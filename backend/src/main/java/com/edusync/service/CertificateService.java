package com.edusync.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edusync.entity.Certificate;
import com.edusync.repository.CertificateRepository;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    // Save certificate with only title + filePath
    public Certificate saveCertificate(Long userId, String title, String filePath) {
        Certificate certificate = new Certificate();
        certificate.setUserId(userId);
        certificate.setTitle(title);
        certificate.setFilePath(filePath);
        certificate.setUploadDate(LocalDateTime.now());
        return certificateRepository.save(certificate);
    }

    // Save certificate with title + description + type
    public Certificate saveCertificate(Long userId, String title, String description, String type, String filePath) {
        Certificate certificate = new Certificate();
        certificate.setUserId(userId);
        certificate.setTitle(title);
        certificate.setDescription(description);
        certificate.setType(type); // ✅ fixed: use setType instead of setCategory
        certificate.setFilePath(filePath);
        certificate.setUploadDate(LocalDateTime.now());
        return certificateRepository.save(certificate);
    }

    // Get all certificates for a user
    public List<Certificate> getCertificatesByUserId(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    // Delete certificate by id & userId (also removes file from disk)
    public boolean deleteCertificate(Long id, Long userId) {
        Optional<Certificate> certOpt = certificateRepository.findById(id);
        if (certOpt.isPresent() && certOpt.get().getUserId().equals(userId)) {
            Certificate cert = certOpt.get();
            // Delete file from disk
            File file = new File(cert.getFilePath());
            if (file.exists()) {
                file.delete();
            }
            certificateRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get certificate by ID
    public Optional<Certificate> getCertificateById(Long id) {
        return certificateRepository.findById(id);
    }

    // Get certificate by ID and User ID
    public Optional<Certificate> getCertificateByIdAndUserId(Long id, Long userId) {
        Optional<Certificate> certOpt = certificateRepository.findById(id);
        if (certOpt.isPresent() && certOpt.get().getUserId().equals(userId)) {
            return certOpt;
        }
        return Optional.empty();
    }
}
