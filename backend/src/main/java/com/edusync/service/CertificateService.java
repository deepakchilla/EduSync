package com.edusync.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edusync.entity.Certificate;
import com.edusync.repository.CertificateRepository;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    public Certificate saveCertificate(Long userId, String title, String description, String type, String filePath) {
        Certificate certificate = new Certificate();
        certificate.setUserId(userId);
        certificate.setTitle(title);
        certificate.setDescription(description);
        certificate.setType(type);
        certificate.setFilePath(filePath);
        certificate.setUploadDate(LocalDateTime.now());
        return certificateRepository.save(certificate);
    }

    public List<Certificate> getCertificatesByUserId(Long userId) {
        return certificateRepository.findByUserId(userId);
    }
}
