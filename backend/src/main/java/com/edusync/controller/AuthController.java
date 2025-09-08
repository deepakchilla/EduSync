package com.edusync.controller;

import com.edusync.dto.LoginRequest;
import com.edusync.dto.RegisterRequest;
import com.edusync.dto.ResetPasswordRequest;
import com.edusync.dto.ApiResponse;
import com.edusync.entity.User;
import com.edusync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            System.err.println("Validation error - " + fieldName + ": " + errorMessage);
        });
        
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Validation failed", errors));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            System.out.println("=== REGISTRATION REQUEST RECEIVED ===");
            System.out.println("First Name: '" + request.getFirstName() + "'");
            System.out.println("Last Name: '" + request.getLastName() + "'");
            System.out.println("Email: '" + request.getEmail() + "'");
            System.out.println("Password: '" + request.getPassword() + "' (length: " + (request.getPassword() != null ? request.getPassword().length() : "null") + ")");
            System.out.println("Role: '" + request.getRole() + "'");
            System.out.println("=====================================");
            
            User user = userService.registerUser(request);
            
            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("message", "User registered successfully");
            
            System.out.println("User registered successfully: " + user.getId());
            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", data));
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.authenticateUser(request);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            
            // Return profile picture as base64 if it exists
            if (user.getProfilePicture() != null) {
                userData.put("profilePicture", user.getProfilePicture());
                System.out.println("Login profile picture found");
            } else {
                userData.put("profilePicture", null);
            }
            
            userData.put("createdAt", user.getCreatedAt());
            userData.put("lastLogin", user.getLastLogin());
            
            // Generate a session token with user ID embedded
            String sessionToken = "session_" + System.currentTimeMillis() + "_" + user.getId();
            System.out.println("Session created for user: " + user.getEmail() + " with token: " + sessionToken);
            
            Map<String, Object> data = new HashMap<>();
            data.put("user", userData);
            data.put("sessionToken", sessionToken);
            data.put("message", "Login successful");
            
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", data));
        } catch (RuntimeException e) {
            // Return user-friendly error messages
            String errorMessage = e.getMessage();
            if (errorMessage.contains("Invalid credentials")) {
                errorMessage = "Invalid email or password. Please check your credentials and try again.";
            } else if (errorMessage.contains("User not found")) {
                errorMessage = "No account found with this email address.";
            }
            return ResponseEntity.badRequest().body(new ApiResponse(false, errorMessage, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Login failed. Please try again.", null));
        }
    }

    @GetMapping("/session")
    public ResponseEntity<ApiResponse> getSession(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // For demo purposes, we'll return the last logged in user
            // In a real app, you'd decode the JWT and get user info from it
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (token != null && !token.isEmpty()) {
                    // For demo: return the last user from database
                    // In production: decode JWT and get user by ID
                    List<User> users = userService.getAllUsers();
                    if (!users.isEmpty()) {
                        User lastUser = users.get(0); // Get first user for demo
                        
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("id", lastUser.getId());
                        userData.put("firstName", lastUser.getFirstName());
                        userData.put("lastName", lastUser.getLastName());
                        userData.put("email", lastUser.getEmail());
                        userData.put("role", lastUser.getRole());
                        
                        // Return profile picture as base64 if it exists
                        if (lastUser.getProfilePicture() != null) {
                            userData.put("profilePicture", lastUser.getProfilePicture());
                            System.out.println("Session profile picture found");
                        } else {
                            userData.put("profilePicture", null);
                        }
                        
                        userData.put("createdAt", lastUser.getCreatedAt());
                        userData.put("lastLogin", lastUser.getLastLogin());
                        
                        Map<String, Object> data = new HashMap<>();
                        data.put("user", userData);
                        
                        return ResponseEntity.ok(new ApiResponse(true, "Session valid", data));
                    }
                }
            }
            
            return ResponseEntity.status(401).body(new ApiResponse(false, "No valid session", null));
        } catch (Exception e) {
            System.err.println("Session error: " + e.getMessage());
            return ResponseEntity.status(401).body(new ApiResponse(false, "Session error", null));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            System.out.println("=== RESET PASSWORD REQUEST ===");
            System.out.println("Email: " + request.getEmail());
            System.out.println("==============================");
            
            String message = userService.resetPasswordByEmail(request.getEmail(), request.getNewPassword());
            
            return ResponseEntity.ok(new ApiResponse(true, message, null));
        } catch (RuntimeException e) {
            System.err.println("Reset password failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("Reset password failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Password reset failed. Please try again.", null));
        }
    }
}
