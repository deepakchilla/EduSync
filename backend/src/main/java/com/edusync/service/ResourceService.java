package com.edusync.service;

import com.edusync.entity.Resource;
import com.edusync.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Upload resource with branch
    public Resource saveResource(MultipartFile file, String title, String description,
                                 String fileType, Long uploadedBy, String branch, String subject) throws IOException {
        // Save file to disk
        String storedFileName = fileStorageService.storeResourceFile(file);

        // Create Resource entity
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setFileName(storedFileName);
        resource.setFileSize(file.getSize());
        resource.setFileType(fileType);
        resource.setUploadedBy(uploadedBy);
        resource.setBranch(branch);
        if (subject != null && !subject.isBlank()) {
            resource.setSubject(subject);
        }

        return resourceRepository.save(resource);
    }

    // Get all resources
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // Filter by branch
    public List<Resource> getResourcesByBranch(String branch) {
        return resourceRepository.findByBranch(branch);
    }

    // Get single resource
    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    // Delete resource
    public boolean deleteResource(Long id) {
        Optional<Resource> resourceOpt = resourceRepository.findById(id);
        if (resourceOpt.isPresent()) {
            Resource resource = resourceOpt.get();
            // Delete file from disk
            fileStorageService.deleteResourceFile(resource.getFileName());
            // Delete from DB
            resourceRepository.delete(resource);
            return true;
        }
        return false;
    }
}
