package com.jsp.edusync.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.ResourceRepository;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Autowired
    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAvailableResources() {
        return resourceRepository.findAll();
    }
    
    public List<Resource> getResourcesByUploader(User uploader) {
        return resourceRepository.findByUploader(uploader);
    }

    public List<Resource> searchResources(String query) {
        return resourceRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public Resource saveResource(String title,
                                 String description,
                                 String fileName,
                                 String fileType,
                                 Long fileSize,
                                 byte[] data,
                                 User uploader) {
        Resource r = new Resource(
                title,
                description,
                fileName,
                fileType,
                fileSize,
                LocalDateTime.now(),
                data,
                uploader
        );
        return resourceRepository.save(r);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    public Resource updateResource(Long id, String title, String description) {
        Resource r = resourceRepository.findById(id).orElseThrow();
        r.setTitle(title);
        r.setDescription(description);
        return resourceRepository.save(r);
    }
}
