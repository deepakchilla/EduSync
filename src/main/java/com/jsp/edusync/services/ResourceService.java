package com.jsp.edusync.services;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.models.ViewedResource;
import com.jsp.edusync.repositories.ResourceRepository;
import com.jsp.edusync.repositories.ViewedResourceRepository;
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
    private ViewedResourceRepository viewedResourceRepository;
    
    /**
     * Upload a new resource
     */
    public Resource uploadResource(String title, String description, MultipartFile file, User faculty) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }
        
        Resource resource = new Resource(
            title,
            description,
            file.getOriginalFilename(),
            file.getContentType(),
            file.getBytes(),
            faculty
        );
        
        return resourceRepository.save(resource);
    }
    
    /**
     * Get all resources
     */
    public List<Resource> getAllResources() {
        return resourceRepository.findAllByOrderByUploadDateDesc();
    }
    
    /**
     * Get resource by ID
     */
    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }
    
    /**
     * Get resources by faculty
     */
    public List<Resource> getResourcesByFaculty(User faculty) {
        return resourceRepository.findByFaculty(faculty);
    }
    
    /**
     * Get resources by faculty ID
     */
    public List<Resource> getResourcesByFacultyId(Long facultyId) {
        return resourceRepository.findByFacultyId(facultyId);
    }
    
    /**
     * Update resource
     */
    public Resource updateResource(Long id, String title, String description, MultipartFile file) throws IOException {
        Optional<Resource> optionalResource = resourceRepository.findById(id);
        if (optionalResource.isEmpty()) {
            throw new RuntimeException("Resource not found");
        }
        
        Resource resource = optionalResource.get();
        resource.setTitle(title);
        resource.setDescription(description);
        
        if (file != null && !file.isEmpty()) {
            resource.setFileName(file.getOriginalFilename());
            resource.setFileType(file.getContentType());
            resource.setFileData(file.getBytes());
        }
        
        return resourceRepository.save(resource);
    }
    
    /**
     * Delete resource
     */
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
    
    /**
     * Search resources by title
     */
    public List<Resource> searchResourcesByTitle(String title) {
        return resourceRepository.findByTitleContainingIgnoreCase(title);
    }
    
    /**
     * Get resources by file type
     */
    public List<Resource> getResourcesByFileType(String fileType) {
        return resourceRepository.findByFileType(fileType);
    }
    
    /**
     * Get resources uploaded after a certain date
     */
    public List<Resource> getResourcesUploadedAfter(LocalDateTime date) {
        return resourceRepository.findByUploadDateAfter(date);
    }
    
    /**
     * Track resource access (view or download)
     */
    public void trackResourceAccess(User student, Resource resource, ViewedResource.AccessType accessType) {
        // Check if already tracked for this session
        Optional<ViewedResource> existing = viewedResourceRepository.findByStudentAndResource(student, resource);
        
        if (existing.isEmpty()) {
            ViewedResource viewedResource = new ViewedResource(student, resource, accessType);
            viewedResourceRepository.save(viewedResource);
        } else {
            // Update access type and date if different or if it's a new day
            ViewedResource viewedResource = existing.get();
            LocalDateTime now = LocalDateTime.now();
            
            // If it's a different access type or more than 1 hour has passed, create new record
            if (!viewedResource.getAccessType().equals(accessType) || 
                viewedResource.getViewedDate().plusHours(1).isBefore(now)) {
                ViewedResource newViewedResource = new ViewedResource(student, resource, accessType);
                viewedResourceRepository.save(newViewedResource);
            }
        }
    }
    
    /**
     * Get previously accessed resources by student
     */
    public List<Resource> getPreviouslyAccessedResources(User student) {
        return viewedResourceRepository.findDistinctResourcesByStudent(student);
    }
    
    /**
     * Get viewed resources by student
     */
    public List<ViewedResource> getViewedResourcesByStudent(User student) {
        return viewedResourceRepository.findByStudentOrderByViewedDateDesc(student);
    }
    
    /**
     * Get resource count by faculty
     */
    public long getResourceCountByFaculty(User faculty) {
        return resourceRepository.countByFaculty(faculty);
    }
    
    /**
     * Get total resource count
     */
    public long getTotalResourceCount() {
        return resourceRepository.count();
    }
    
    /**
     * Check if student has accessed a resource
     */
    public boolean hasStudentAccessedResource(User student, Resource resource) {
        return viewedResourceRepository.existsByStudentAndResource(student, resource);
    }
    
    /**
     * Get access count for a resource
     */
    public long getResourceAccessCount(Resource resource) {
        return viewedResourceRepository.countByResource(resource);
    }
}
