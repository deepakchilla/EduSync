package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.entity.User;
import com.edusync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@RequestParam("userEmail") String userEmail) {
        try {
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            // Create a safe user object without password
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("profilePicture", user.getProfilePicture());
            userData.put("createdAt", user.getCreatedAt());
            userData.put("lastLogin", user.getLastLogin());

            return ResponseEntity.ok(new ApiResponse(true, "Profile retrieved successfully", userData));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to retrieve profile", null)
            );
        }
    }

    @PostMapping("/profile/update")
    public ResponseEntity<ApiResponse> updateProfile(
            @RequestBody Map<String, Object> requestData) {
        try {
            String userEmail = (String) requestData.get("userEmail");
            if (userEmail == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "userEmail is required", null)
                );
            }
            
            // Remove userEmail from updateData to avoid conflicts
            Map<String, Object> updateData = new HashMap<>(requestData);
            updateData.remove("userEmail");
            
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            // Update allowed fields
            if (updateData.containsKey("firstName")) {
                user.setFirstName((String) updateData.get("firstName"));
            }
            if (updateData.containsKey("lastName")) {
                user.setLastName((String) updateData.get("lastName"));
            }

            User updatedUser = userService.saveUser(user);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", updatedUser.getId());
            userData.put("firstName", updatedUser.getFirstName());
            userData.put("lastName", updatedUser.getLastName());
            userData.put("email", updatedUser.getEmail());
            userData.put("role", updatedUser.getRole());
            userData.put("profilePicture", updatedUser.getProfilePicture());
            userData.put("createdAt", updatedUser.getCreatedAt());
            userData.put("lastLogin", updatedUser.getLastLogin());

            return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully", userData));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to update profile", null)
            );
        }
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<ApiResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userEmail") String userEmail) {
        try {
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Please select a file to upload", null)
                );
            }

            // Validate file size (5MB limit for profile pictures)
            long maxSize = 5L * 1024 * 1024; // 5MB in bytes
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "File size must be less than 5MB", null)
                );
            }

            // Validate file type (only images)
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Only image files are allowed", null)
                );
            }

            // Convert file to base64 and store as string
            byte[] imageBytes = file.getBytes();
            String base64Image = "data:" + file.getContentType() + ";base64," + java.util.Base64.getEncoder().encodeToString(imageBytes);
            user.setProfilePicture(base64Image);
            
            User updatedUser = userService.saveUser(user);

            // Return the base64 image data for immediate display
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("profilePicture", base64Image);
            
            return ResponseEntity.ok(new ApiResponse(true, "Profile picture uploaded successfully", responseData));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to upload profile picture", null)
            );
        }
    }

    @DeleteMapping("/profile-picture")
    public ResponseEntity<ApiResponse> removeProfilePicture(@RequestParam("userEmail") String userEmail) {
        try {
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            if (user.getProfilePicture() != null) {
                // Update user to remove profile picture
                user.setProfilePicture(null);
                userService.saveUser(user);
            }

            return ResponseEntity.ok(new ApiResponse(true, "Profile picture removed successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to remove profile picture", null)
            );
        }
    }
}
