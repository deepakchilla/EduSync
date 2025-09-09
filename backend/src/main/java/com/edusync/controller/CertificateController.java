package com.edusync.controller;

import com.edusync.entity.Certificate;
import com.edusync.repository.UserRepository;
import com.edusync.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir =
            System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "certificates" + File.separator;

    // =========================
    // Upload
    // =========================
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
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "User not found", null));
            }
            Long userId = userOpt.get().getId();

            // Ensure upload dir
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse<>(false, "Failed to create upload directory", null));
            }

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "File is empty", null));
            }
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/")
                    && !contentType.equals("application/pdf")
                    && !contentType.equals("application/msword")
                    && !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Only images, PDF, and Word documents are allowed", null));
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Invalid filename", null));
            }

            // Unique filename
            String safeName = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            String fileName = System.currentTimeMillis() + "_" + userId + "_" + safeName;
            String filePath = uploadDir + fileName;

            // Save to disk
            file.transferTo(new File(filePath));

            // Save DB
            Certificate saved = certificateService.saveCertificate(userId, title, description, type, filePath);
            return ResponseEntity.ok(new ApiResponse<>(true, "Certificate uploaded successfully", saved));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "File upload failed: " + e.getMessage(), null));
        }
    }

    // =========================
    // List by userId
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificates(@PathVariable Long userId) {
        return ResponseEntity.ok(certificateService.getCertificatesByUserId(userId));
    }

    // =========================
    // List by userEmail (frontend uses this)
    // =========================
    @GetMapping("/my")
    public ResponseEntity<?> getMyCertificates(@RequestParam("userEmail") String userEmail) {
        try {
            Optional<com.edusync.entity.User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }
            Long userId = userOpt.get().getId();
            List<Certificate> certificates = certificateService.getCertificatesByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Certificates retrieved successfully", certificates));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving certificates: " + e.getMessage(), null));
        }
    }

    // =========================
    // Delete (frontend: DELETE /{id}?userEmail=...)
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCertificate(@PathVariable Long id, @RequestParam("userEmail") String userEmail) {
        try {
            Optional<com.edusync.entity.User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }
            Long userId = userOpt.get().getId();

            boolean deleted = certificateService.deleteCertificate(id, userId); // matches service
            if (deleted) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Certificate deleted successfully", null));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Certificate not found or not owned by user", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error deleting certificate: " + e.getMessage(), null));
        }
    }

    // =========================
    // View inline (supports optional userEmail/UserEmail)
    // =========================
    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewCertificate(@PathVariable Long id,
                                             @RequestParam(name = "userEmail", required = false) String userEmail,
                                             @RequestParam(name = "UserEmail", required = false) String userEmailAlt) {
        try {
            String effectiveEmail = (userEmail != null && !userEmail.isBlank()) ? userEmail : userEmailAlt;

            Optional<Certificate> certOpt;
            if (effectiveEmail == null || effectiveEmail.isBlank()) {
                certOpt = certificateService.getCertificateById(id); // matches service
            } else {
                Optional<com.edusync.entity.User> userOpt = userRepository.findByEmail(effectiveEmail);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
                }
                Long userId = userOpt.get().getId();
                certOpt = certificateService.getCertificateByIdAndUserId(id, userId); // matches service
            }

            if (certOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate not found");
            }

            Certificate certificate = certOpt.get();
            File file = new File(certificate.getFilePath());
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            String lower = file.getName().toLowerCase();
            String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = MediaType.IMAGE_JPEG_VALUE;
            else if (lower.endsWith(".png")) contentType = MediaType.IMAGE_PNG_VALUE;
            else if (lower.endsWith(".gif")) contentType = MediaType.IMAGE_GIF_VALUE;
            else if (lower.endsWith(".pdf")) contentType = MediaType.APPLICATION_PDF_VALUE;

            // stream inline
            FileInputStream fis = new FileInputStream(file);
            Resource resource = new InputStreamResource(fis);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header("Cache-Control", "max-age=3600")
                    .header("Content-Disposition", "inline; filename=\"" + file.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error viewing certificate: " + e.getMessage());
        }
    }

    // Support legacy path "/view{id}" (missing slash)
    @GetMapping("/view{id}")
    public ResponseEntity<?> viewCertificateNoSlash(@PathVariable Long id,
                                                    @RequestParam(name = "userEmail", required = false) String userEmail,
                                                    @RequestParam(name = "UserEmail", required = false) String userEmailAlt) {
        return viewCertificate(id, userEmail, userEmailAlt);
    }

    // =========================
    // Download
    // =========================
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadCertificate(@PathVariable Long id, @RequestParam("userEmail") String userEmail) {
        try {
            Optional<com.edusync.entity.User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }
            Long userId = userOpt.get().getId();

            Optional<Certificate> certOpt = certificateService.getCertificateByIdAndUserId(id, userId); // matches service
            if (certOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Certificate not found");
            }

            Certificate certificate = certOpt.get();
            File file = new File(certificate.getFilePath());
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
                    .body(new FileSystemResource(file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error downloading certificate: " + e.getMessage());
        }
    }

    // =========================
    // API response wrapper
    // =========================
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }

        public void setSuccess(boolean success) { this.success = success; }
        public void setMessage(String message) { this.message = message; }
        public void setData(T data) { this.data = data; }
    }
}
