package com.jsp.edusync.controllers;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.models.ViewedResource;
import com.jsp.edusync.services.ResourceService;
import com.jsp.edusync.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/api")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ResourceService resourceService;
    
    // ================== Authentication Endpoints ==================
    
    /**
     * User Registration (JSON API)
     */
    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            String roleStr = request.get("role");
            
            if (name == null || email == null || password == null || roleStr == null) {
                response.put("success", false);
                response.put("message", "All fields are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            User user = userService.registerUser(name, email, password, role);
            
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * User Login (JSON API)
     */
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> request, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                response.put("success", false);
                response.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<User> userOpt = userService.authenticateUser(email, password);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                session.setAttribute("user", user);
                
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString()
                ));
                response.put("redirectUrl", user.getRole() == User.Role.FACULTY ? "/faculty-dashboard" : "/student-dashboard");
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * User Logout
     */
    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> logoutUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        session.invalidate();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current user session
     */
    @GetMapping("/session")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user != null) {
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString()
            ));
        } else {
            response.put("success", false);
            response.put("message", "No active session");
        }
        
        return ResponseEntity.ok(response);
    }
    
    // ================== Resource Management Endpoints ==================
    
    /**
     * Upload Resource (Faculty only)
     */
    @PostMapping("/resources/upload")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> uploadResource(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Access denied. Faculty access required.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            Resource resource = resourceService.uploadResource(title, description, file, user);
            
            response.put("success", true);
            response.put("message", "Resource uploaded successfully");
            response.put("resource", Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString()
            ));
            
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
    
    /**
     * Get All Resources
     */
    @GetMapping("/resources")
    @ResponseBody
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
            response.put("resources", resources.stream().map(resource -> Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString(),
                "facultyName", resource.getFaculty().getName()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get Resources by Faculty (Faculty only - their own resources)
     */
    @GetMapping("/resources/faculty")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getFacultyResources(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Access denied. Faculty access required.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.getResourcesByFaculty(user);
            
            response.put("success", true);
            response.put("resources", resources.stream().map(resource -> Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Download/View Resource File
     */
    @GetMapping("/resources/{id}/file")
    public ResponseEntity<byte[]> downloadResource(@PathVariable Long id, 
                                                   @RequestParam(defaultValue = "download") String action,
                                                   HttpSession session) {
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
                ViewedResource.AccessType accessType = "view".equals(action) ? 
                    ViewedResource.AccessType.VIEWED : ViewedResource.AccessType.DOWNLOADED;
                resourceService.trackResourceAccess(user, resource, accessType);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(resource.getFileType()));
            
            if ("download".equals(action)) {
                headers.setContentDispositionFormData("attachment", resource.getFileName());
            } else {
                headers.setContentDispositionFormData("inline", resource.getFileName());
            }
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource.getFileData());
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update Resource (Faculty only)
     */
    @PutMapping("/resources/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateResource(@PathVariable Long id,
                                                              @RequestParam("title") String title,
                                                              @RequestParam("description") String description,
                                                              @RequestParam(value = "file", required = false) MultipartFile file,
                                                              HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Access denied. Faculty access required.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            Resource resource = resourceService.updateResource(id, title, description, file);
            
            response.put("success", true);
            response.put("message", "Resource updated successfully");
            response.put("resource", Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString()
            ));
            
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
    
    /**
     * Delete Resource (Faculty only)
     */
    @DeleteMapping("/resources/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.FACULTY) {
            response.put("success", false);
            response.put("message", "Access denied. Faculty access required.");
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
    
    /**
     * Get Previously Accessed Resources (Students only)
     */
    @GetMapping("/resources/accessed")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getPreviouslyAccessedResources(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user == null || user.getRole() != User.Role.STUDENT) {
            response.put("success", false);
            response.put("message", "Access denied. Student access required.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        try {
            List<Resource> resources = resourceService.getPreviouslyAccessedResources(user);
            
            response.put("success", true);
            response.put("resources", resources.stream().map(resource -> Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString(),
                "facultyName", resource.getFaculty().getName()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch accessed resources");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Search Resources
     */
    @GetMapping("/resources/search")
    @ResponseBody
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
            response.put("resources", resources.stream().map(resource -> Map.of(
                "id", resource.getId(),
                "title", resource.getTitle(),
                "description", resource.getDescription(),
                "fileName", resource.getFileName(),
                "fileType", resource.getFileType(),
                "uploadDate", resource.getUploadDate().toString(),
                "facultyName", resource.getFaculty().getName()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Search failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
