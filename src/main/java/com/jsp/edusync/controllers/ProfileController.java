package com.jsp.edusync.controllers;

import com.jsp.edusync.models.User;
import com.jsp.edusync.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ProfileController {
    
    @Autowired
    private UserService userService;
    
    // No more file upload directory needed - storing directly in database
    
    @PostMapping("/upload-picture")
    public ResponseEntity<Map<String, Object>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "Only image files are allowed");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "File size must be less than 5MB");
                return ResponseEntity.badRequest().body(response);
            }
            
            // No need to save file to disk - storing directly in database
            
            // Update user profile picture - store as byte[] in database
            user.setProfilePicture(file.getBytes());
            user.setProfilePictureType(file.getContentType());
            userService.updateUser(user);
            
            // Return the user ID for the new endpoint
            String profilePictureUrl = "/api/user/" + user.getId() + "/profile-picture";
            
            // Update session
            session.setAttribute("user", user);
            
            response.put("success", true);
            response.put("message", "Profile picture uploaded successfully");
            response.put("profilePictureUrl", profilePictureUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Profile picture serving moved to UserController.getProfilePicture()
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProfileStats(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Get user statistics
            Map<String, Object> stats = userService.getUserStats(user.getId());
            
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get profile stats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/remove-picture")
    public ResponseEntity<Map<String, Object>> removeProfilePicture(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Remove profile picture from user
            user.setProfilePicture(null);
            user.setProfilePictureType(null);
            userService.updateUser(user);
            
            // Update session
            session.setAttribute("user", user);
            
            response.put("success", true);
            response.put("message", "Profile picture removed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to remove profile picture: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
