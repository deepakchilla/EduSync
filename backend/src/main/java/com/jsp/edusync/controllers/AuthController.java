package com.jsp.edusync.controllers;

import com.jsp.edusync.models.User;
import com.jsp.edusync.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String password = request.get("password");
            String roleStr = request.get("role");
            
            if (email == null || password == null || roleStr == null) {
                response.put("success", false);
                response.put("message", "Email, password, and role are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<User> userOpt = userService.authenticateUser(email, password);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Check if role matches
                String userRole = user.getRole().toString().toLowerCase();
                if (!userRole.equals(roleStr.toLowerCase())) {
                    response.put("success", false);
                    response.put("message", "Invalid role for this user");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
                
                session.setAttribute("user", user);
                
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", Map.of(
                    "id", user.getId().toString(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", userRole
                ));
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
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
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString().toLowerCase()
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
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        session.invalidate();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        
        if (user != null) {
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().toString().toLowerCase()
            ));
        } else {
            response.put("success", false);
            response.put("message", "No active session");
        }
        
        return ResponseEntity.ok(response);
    }
}
