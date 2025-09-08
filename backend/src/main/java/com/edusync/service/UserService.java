package com.edusync.service;

import com.edusync.dto.LoginRequest;
import com.edusync.dto.RegisterRequest;
import com.edusync.dto.ResetPasswordRequest;
import com.edusync.entity.User;
import com.edusync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(RegisterRequest request) throws Exception {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new Exception("User with this email already exists");
        }

        // Convert role string to UserRole enum
        User.UserRole userRole;
        try {
            userRole = User.UserRole.fromString(request.getRole());
            if (userRole == null) {
                throw new Exception("Invalid role. Must be 'student' or 'faculty'");
            }
        } catch (Exception e) {
            throw new Exception("Invalid role. Must be 'student' or 'faculty'");
        }

        // Create new user (simple password storage for hackathon)
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Simple storage for hackathon
        user.setRole(userRole);

        return userRepository.save(user);
    }

    public User authenticateUser(LoginRequest request) {
        // Simple authentication for hackathon
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if (user.getPassword().equals(request.getPassword())) { // Simple comparison for hackathon
                // Update last login time
                user.setLastLogin(java.time.LocalDateTime.now());
                return userRepository.save(user);
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public String resetPasswordByEmail(String email, String newPassword) {
        User user = findByEmail(email);
        if (user == null) {
            throw new RuntimeException("No account found with this email address");
        }
        
        // Update password directly
        user.setPassword(newPassword);
        userRepository.save(user);
        
        return "Password has been reset successfully";
    }
}
