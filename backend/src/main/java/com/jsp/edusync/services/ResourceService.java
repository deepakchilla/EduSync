package com.jsp.edusync.services;

import com.jsp.edusync.models.AccessedResource;
import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.AccessedResourceRepository;
import com.jsp.edusync.repositories.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private AccessedResourceRepository accessedResourceRepository;
    
    public Resource uploadResource(String title, String description, MultipartFile file, User uploadedBy) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }
        
        Resource resource = new Resource(
            title,
            description,
            file.getOriginalFilename(),
            file.getContentType(),
            file.getSize(),
            file.getBytes(),
            uploadedBy
        );
        
        return resourceRepository.save(resource);
    }
    
    public List<Resource> getAllResources() {
        return resourceRepository.findAllByOrderByUploadedAtDesc();
    }
    
    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }
    
    public List<Resource> getResourcesByUser(User uploadedBy) {
        return resourceRepository.findByUploadedBy(uploadedBy);
    }
    
    public List<Resource> getResourcesByUserId(Long userId) {
        return resourceRepository.findByUploadedById(userId);
    }
    
    public Resource updateResource(Long id, String title, String description, MultipartFile file) throws IOException {
        Optional<Resource> optionalResource = resourceRepository.findById(id);
        if (optionalResource.isEmpty()) {
            throw new RuntimeException("Resource not found");
        }
        
        Resource resource = optionalResource.get();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setLastModified(LocalDateTime.now());
        
        if (file != null && !file.isEmpty()) {
            resource.setFileName(file.getOriginalFilename());
            resource.setFileType(file.getContentType());
            resource.setFileSize(file.getSize());
            resource.setFileData(file.getBytes());
        }
        
        return resourceRepository.save(resource);
    }
    
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
    
    public List<Resource> searchResourcesByTitle(String title) {
        return resourceRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Resource> getResourcesByFileType(String fileType) {
        return resourceRepository.findByFileType(fileType);
    }
    
    public void trackResourceAccess(User user, Resource resource) {
        // Check if already accessed recently (within last hour)
        Optional<AccessedResource> existing = accessedResourceRepository.findByUserAndResource(user, resource);
        
        if (existing.isEmpty() || existing.get().getAccessedAt().isBefore(LocalDateTime.now().minusHours(1))) {
            AccessedResource accessedResource = new AccessedResource(user, resource);
            accessedResourceRepository.save(accessedResource);
        }
    }
    
    public List<Resource> getRecentlyAccessedResources(User user) {
        return accessedResourceRepository.findDistinctResourcesByUserOrderByAccessedAtDesc(user);
    }
    
    public List<AccessedResource> getAccessHistory(User user) {
        return accessedResourceRepository.findByUserOrderByAccessedAtDesc(user);
    }
    
    public long getResourceCountByUser(User user) {
        return resourceRepository.countByUploadedBy(user);
    }
    
    public long getTotalResourceCount() {
        return resourceRepository.count();
    }
    
    public boolean hasUserAccessedResource(User user, Resource resource) {
        return accessedResourceRepository.existsByUserAndResource(user, resource);
    }
    
    public long getResourceAccessCount(Resource resource) {
        return accessedResourceRepository.countByResource(resource);
    }
}
