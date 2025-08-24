package com.jsp.edusync.services;

import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Register a new user
     */
    public User registerUser(String name, String email, String password, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(name, email, password, role);
        return userRepository.save(user);
    }
    
    /**
     * Authenticate user login
     */
    public Optional<User> authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Get users by role
     */
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }
    
    /**
     * Get all faculty members
     */
    public List<User> getAllFaculty() {
        return userRepository.findByRole(User.Role.FACULTY);
    }
    
    /**
     * Get all students
     */
    public List<User> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT);
    }
    
    /**
     * Update user information
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * Delete user by ID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    /**
     * Check if email exists
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Search users by name
     */
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }
    
    /**
     * Get user count by role
     */
    public long getUserCountByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    /**
     * Get total user count
     */
    public long getTotalUserCount() {
        return userRepository.count();
    }
}
