package com.jsp.edusync.config;

import com.jsp.edusync.models.User;
import com.jsp.edusync.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");
        
        // Create test faculty users
        createTestUsers();
        
        logger.info("Data initialization completed successfully!");
    }
    
    private void createTestUsers() {
        // Faculty users
        if (!userService.emailExists("faculty1@edusync.com")) {
            try {
                userService.registerUser("Dr. John Smith", "faculty1@edusync.com", "faculty123", User.Role.FACULTY);
                logger.info("Created test faculty: Dr. John Smith");
            } catch (Exception e) {
                logger.error("Failed to create faculty Dr. John Smith: " + e.getMessage());
            }
        }
        
        if (!userService.emailExists("faculty2@edusync.com")) {
            try {
                userService.registerUser("Prof. Sarah Johnson", "faculty2@edusync.com", "faculty456", User.Role.FACULTY);
                logger.info("Created test faculty: Prof. Sarah Johnson");
            } catch (Exception e) {
                logger.error("Failed to create faculty Prof. Sarah Johnson: " + e.getMessage());
            }
        }
        
        // Student users
        if (!userService.emailExists("student1@edusync.com")) {
            try {
                userService.registerUser("Alice Williams", "student1@edusync.com", "student123", User.Role.STUDENT);
                logger.info("Created test student: Alice Williams");
            } catch (Exception e) {
                logger.error("Failed to create student Alice Williams: " + e.getMessage());
            }
        }
        
        if (!userService.emailExists("student2@edusync.com")) {
            try {
                userService.registerUser("Bob Davis", "student2@edusync.com", "student456", User.Role.STUDENT);
                logger.info("Created test student: Bob Davis");
            } catch (Exception e) {
                logger.error("Failed to create student Bob Davis: " + e.getMessage());
            }
        }
        
        if (!userService.emailExists("student3@edusync.com")) {
            try {
                userService.registerUser("Carol Miller", "student3@edusync.com", "student789", User.Role.STUDENT);
                logger.info("Created test student: Carol Miller");
            } catch (Exception e) {
                logger.error("Failed to create student Carol Miller: " + e.getMessage());
            }
        }
    }
}
