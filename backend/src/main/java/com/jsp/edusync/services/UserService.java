package com.jsp.edusync.services;

import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(String name, String email, String password, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(name, email, password, role);
        return userRepository.save(user);
    }
    
    public Optional<User> authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public long getUserCountByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    public long getTotalUserCount() {
        return userRepository.count();
    }
    
    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            Optional<User> userOpt = findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Basic user info
                stats.put("userId", user.getId());
                stats.put("name", user.getName());
                stats.put("email", user.getEmail());
                stats.put("role", user.getRole());
                stats.put("profilePicture", user.getProfilePicture());
                stats.put("createdAt", user.getCreatedAt());
                stats.put("lastLogin", user.getLastLogin());
                
                // Role-specific stats
                if (user.getRole() == User.Role.FACULTY) {
                    // Faculty stats (resources uploaded, etc.)
                    stats.put("resourcesUploaded", 0); // TODO: Implement when ResourceService is ready
                    stats.put("totalDownloads", 0);
                } else {
                    // Student stats (resources accessed, etc.)
                    stats.put("resourcesAccessed", 0); // TODO: Implement when ResourceService is ready
                    stats.put("lastAccess", null);
                }
            }
        } catch (Exception e) {
            stats.put("error", e.getMessage());
        }
        
        return stats;
    }
}
