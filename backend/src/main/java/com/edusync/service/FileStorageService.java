package com.edusync.service;

import com.edusync.config.FileStorageConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Path resourceStorageLocation;

    @Autowired
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir())
                .toAbsolutePath().normalize();
        this.resourceStorageLocation = Paths.get(fileStorageConfig.getUploadDir() + "/resources")
                .toAbsolutePath().normalize();

        try {
            // Create directories if they don't exist
            if (!Files.exists(this.fileStorageLocation)) {
                Files.createDirectories(this.fileStorageLocation);
                System.out.println("Created profile pictures directory: " + this.fileStorageLocation);
            }
            if (!Files.exists(this.resourceStorageLocation)) {
                Files.createDirectories(this.resourceStorageLocation);
                System.out.println("Created resources directory: " + this.resourceStorageLocation);
            }
        } catch (Exception ex) {
            System.err.println("Error creating upload directories: " + ex.getMessage());
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, Long userId) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Generate unique filename to avoid conflicts
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String fileName = "profile_" + userId + "_" + UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Could not delete file " + fileName + ": " + ex.getMessage());
        }
    }

    // Resource file methods
    public String storeResourceFile(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty or null");
            }
            
            // Additional validation
            if (file.getSize() == 0) {
                throw new RuntimeException("File size is 0 bytes");
            }
            
            if (file.getOriginalFilename() == null || file.getOriginalFilename().trim().isEmpty()) {
                throw new RuntimeException("File has no name");
            }

            // Generate unique filename for resources - completely ignore original filename issues
            String fileExtension = "";
            String originalFileName = file.getOriginalFilename();
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            // Create a safe filename with timestamp and UUID
            String fileName = "resource_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + fileExtension;

            // Ensure resources directory exists
            if (!Files.exists(this.resourceStorageLocation)) {
                Files.createDirectories(this.resourceStorageLocation);
                System.out.println("Created resources directory: " + this.resourceStorageLocation);
            }

            // Store in resources directory
            Path targetLocation = this.resourceStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("File stored successfully: " + fileName + " at " + targetLocation);
            return fileName;
        } catch (IOException ex) {
            System.err.println("Error storing resource file: " + ex.getMessage());
            throw new RuntimeException("Could not store resource file. Please try again!", ex);
        } catch (Exception ex) {
            System.err.println("Unexpected error storing resource file: " + ex.getMessage());
            throw new RuntimeException("Unexpected error occurred while storing file", ex);
        }
    }

    public Resource loadResourceFileAsResource(String fileName) {
        try {
            Path filePath = this.resourceStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Resource file not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Resource file not found " + fileName, ex);
        }
    }

    public void deleteResourceFile(String fileName) {
        try {
            Path filePath = this.resourceStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Could not delete resource file " + fileName + ": " + ex.getMessage());
        }
    }
    
    // Utility method to check if upload directories are accessible
    public boolean areUploadDirectoriesAccessible() {
        try {
            return Files.isDirectory(this.fileStorageLocation) && 
                   Files.isDirectory(this.resourceStorageLocation) &&
                   Files.isWritable(this.fileStorageLocation) &&
                   Files.isWritable(this.resourceStorageLocation);
        } catch (Exception e) {
            System.err.println("Error checking upload directory accessibility: " + e.getMessage());
            return false;
        }
    }
    
    // Get upload directory paths for debugging
    public String getUploadDirectoryInfo() {
        return String.format("Profile Pictures: %s, Resources: %s", 
                           this.fileStorageLocation.toString(), 
                           this.resourceStorageLocation.toString());
    }
}

