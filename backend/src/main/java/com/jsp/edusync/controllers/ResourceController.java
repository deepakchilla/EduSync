package com.jsp.edusync.controllers;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.services.ResourceService;
import com.jsp.edusync.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    @Autowired
    private UserService userService;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllResources(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            response.put("success", false);
            response.put("message", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.getAllResources();
            
            response.put("success", true);
            response.put("resources", resources.stream().map(this::mapResourceToResponse).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/my-resources")
    public ResponseEntity<Map<String, Object>> getMyResources(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Faculty access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.getResourcesByUser(user);
            
            response.put("success", true);
            response.put("resources", resources.stream().map(this::mapResourceToResponse).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentlyAccessedResources(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            response.put("success", false);
            response.put("message", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.getRecentlyAccessedResources(user);
            
            response.put("success", true);
            response.put("resources", resources.stream().map(this::mapResourceToResponse).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch recent resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadResource(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Faculty access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            Resource resource = resourceService.uploadResource(title, description, file, user);
            
            response.put("success", true);
            response.put("message", "Resource uploaded successfully");
            response.put("resource", mapResourceToResponse(resource));
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "File upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Faculty access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            Resource resource = resourceService.updateResource(id, title, description, file);
            
            response.put("success", true);
            response.put("message", "Resource updated successfully");
            response.put("resource", mapResourceToResponse(resource));
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "File update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Faculty access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            resourceService.deleteResource(id);
            
            response.put("success", true);
            response.put("message", "Resource deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Delete failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadResource(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Optional<Resource> resourceOpt = resourceService.getResourceById(id);
            
            if (resourceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = resourceOpt.get();
            
            // Track access for students
            if (user.getRole() == User.Role.STUDENT) {
                resourceService.trackResourceAccess(user, resource);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(resource.getFileType()));
            headers.setContentDispositionFormData("attachment", resource.getFileName());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource.getFileData());
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(@RequestParam String query, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            response.put("success", false);
            response.put("message", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.searchResourcesByTitle(query);
            
            response.put("success", true);
            response.put("resources", resources.stream().map(this::mapResourceToResponse).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Search failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    private Map<String, Object> mapResourceToResponse(Resource resource) {
        return Map.of(
            "id", resource.getId().toString(),
            "title", resource.getTitle(),
            "description", resource.getDescription(),
            "fileName", resource.getFileName(),
            "fileType", resource.getFileType(),
            "fileSize", resource.getFileSize(),
            "uploadedBy", resource.getUploadedBy().getName(),
            "uploadedAt", resource.getUploadedAt().format(formatter),
            "lastModified", resource.getLastModified().format(formatter)
        );
    }
}
