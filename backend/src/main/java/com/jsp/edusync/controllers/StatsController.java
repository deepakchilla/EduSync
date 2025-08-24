package com.jsp.edusync.controllers;

import com.jsp.edusync.services.UserService;
import com.jsp.edusync.services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class StatsController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ResourceService resourceService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // User statistics
            stats.put("totalUsers", userService.getTotalUserCount());
            stats.put("totalStudents", userService.getUserCountByRole(com.jsp.edusync.models.User.Role.STUDENT));
            stats.put("totalFaculty", userService.getUserCountByRole(com.jsp.edusync.models.User.Role.FACULTY));
            
            // Resource statistics (when ResourceService is implemented)
            stats.put("totalResources", 0); // TODO: resourceService.getTotalResourceCount()
            stats.put("totalDownloads", 0); // TODO: resourceService.getTotalDownloadCount()
            stats.put("recentUploads", 0); // TODO: resourceService.getRecentUploadCount()
            
            // System statistics
            stats.put("activeSessions", 0); // TODO: Implement session tracking
            stats.put("systemStatus", "Online");
            
            response.put("success", true);
            response.put("stats", stats);
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get dashboard stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/resources")
    public ResponseEntity<Map<String, Object>> getResourceStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Resource statistics (when ResourceService is implemented)
            stats.put("totalResources", 0); // TODO: resourceService.getTotalResourceCount()
            stats.put("resourcesByType", new HashMap<>()); // TODO: resourceService.getResourcesByType()
            stats.put("topDownloaded", new HashMap<>()); // TODO: resourceService.getTopDownloadedResources()
            stats.put("recentUploads", new HashMap<>()); // TODO: resourceService.getRecentUploads()
            
            response.put("success", true);
            response.put("stats", stats);
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get resource stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // User statistics
            stats.put("totalUsers", userService.getTotalUserCount());
            stats.put("totalStudents", userService.getUserCountByRole(com.jsp.edusync.models.User.Role.STUDENT));
            stats.put("totalFaculty", userService.getUserCountByRole(com.jsp.edusync.models.User.Role.FACULTY));
            stats.put("newUsersThisMonth", 0); // TODO: userService.getNewUsersThisMonth()
            stats.put("activeUsers", 0); // TODO: userService.getActiveUsersCount()
            
            response.put("success", true);
            response.put("stats", stats);
            response.put("timestamp", java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get user stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
