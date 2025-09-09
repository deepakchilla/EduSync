package com.edusync.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edusync.entity.Certificate;
import com.edusync.service.CertificateService;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private com.edusync.repository.UserRepository userRepository;

    private final String uploadDir = "uploads/certificates/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("userEmail") String userEmail,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam("file") MultipartFile file) {
        try {
            var userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }

            Long userId = userOpt.get().getId();

            // Ensure upload directory exists
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Build file path
            String filePath = uploadDir + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Save file to disk
            file.transferTo(new File(filePath));

            // Save certificate in DB
            Certificate savedCertificate = certificateService.saveCertificate(
                    userId, title, description, type, filePath
            );

            return ResponseEntity.ok(savedCertificate);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificates(@PathVariable Long userId) {
        List<Certificate> certificates = certificateService.getCertificatesByUserId(userId);
        return ResponseEntity.ok(certificates);
    }
}
