package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.entity.User;
import com.edusync.entity.Resource;
import com.edusync.service.FileStorageService;
import com.edusync.service.UserService;
import com.edusync.service.ResourceService;
import com.edusync.service.SummaryService;
import com.edusync.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private SummaryService summaryService;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        try {
            Map<String, Object> healthData = new HashMap<>();
            healthData.put("status", "healthy");
            healthData.put("uploadDirectoriesAccessible", fileStorageService.areUploadDirectoriesAccessible());
            healthData.put("uploadDirectoryInfo", fileStorageService.getUploadDirectoryInfo());
            healthData.put("databaseStatus", "connected");
            healthData.put("timestamp", System.currentTimeMillis());
            
            // Test database connection
            try {
                long resourceCount = resourceRepository.count();
                healthData.put("resourceCount", resourceCount);
                healthData.put("databaseStatus", "healthy");
            } catch (Exception dbEx) {
                healthData.put("databaseStatus", "error: " + dbEx.getMessage());
            }
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resource service is healthy", healthData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Resource service health check failed: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("branch") String branch,
            @RequestParam(value = "subject", required = false) String subject) {
        
        System.out.println("=== RESOURCE UPLOAD REQUEST ===");
        System.out.println("Title: " + title);
        System.out.println("Description: " + description);
        System.out.println("User Email: " + userEmail);
        System.out.println("File: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
        System.out.println("Content Type: " + file.getContentType());
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Please select a file to upload", null)
                );
            }

            // Validate file size (500MB limit)
            long maxSize = 500L * 1024 * 1024; // 500MB in bytes
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "File size must be less than 500MB", null)
                );
            }

            // Find user
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            // Check if user is faculty
            if (!"FACULTY".equals(user.getRole().toString())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Only faculty members can upload resources", null)
                );
            }

            // Store file
            String storedFileName = fileStorageService.storeResourceFile(file);
            
            // Create resource entity with exact schema fields
            com.edusync.entity.Resource resource = new com.edusync.entity.Resource();
            resource.setTitle(title);
            resource.setDescription(description);
            resource.setFileName(storedFileName);
            resource.setFileSize(file.getSize());
            resource.setFileType(file.getContentType());
            resource.setUploadedBy(user.getId());
            resource.setUploadedAt(LocalDateTime.now());
            resource.setBranch(branch);
            if (subject != null && !subject.isBlank()) {
                resource.setSubject(subject);
            }
            
            // Save to database
            com.edusync.entity.Resource savedResource = resourceRepository.save(resource);
            
            // Return success response
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resourceId", savedResource.getId());
            responseData.put("fileName", storedFileName);
            responseData.put("title", title);
            responseData.put("fileSize", file.getSize());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resource uploaded successfully", responseData)
            );
            
        } catch (Exception e) {
            System.err.println("Error uploading resource: " + e.getMessage());
            e.printStackTrace();
            
            // Provide more specific error messages
            String errorMessage = "Failed to upload resource";
            if (e.getMessage() != null) {
                if (e.getMessage().contains("Could not store")) {
                    errorMessage = "File storage error. Please check if the upload directory is accessible.";
                } else if (e.getMessage().contains("File is empty")) {
                    errorMessage = "Please select a valid file to upload.";
                } else {
                    errorMessage = "Failed to upload resource: " + e.getMessage();
                }
            }
            
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, errorMessage, null)
            );
        }
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getAllResources(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String subject) {
        try {
            List<com.edusync.entity.Resource> resources;
            if (branch != null && !branch.isBlank() && !branch.equalsIgnoreCase("All")) {
                if (subject != null && !subject.isBlank()) {
                    resources = resourceRepository.findByBranchAndSubjectIgnoreCase(branch, subject);
                } else {
                    resources = resourceRepository.findByBranch(branch);
                }
            } else {
                resources = resourceRepository.findAllByOrderByUploadedAtDesc();
            }
            
            // Convert to DTOs with branch/subject
            List<Map<String, Object>> resourceDtos = resources.stream()
                .map(resource -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", resource.getId());
                    dto.put("title", resource.getTitle());
                    dto.put("description", resource.getDescription() != null ? resource.getDescription() : "");
                    dto.put("fileName", resource.getFileName());
                    dto.put("fileSize", resource.getFileSize());
                    dto.put("fileType", resource.getFileType());
                    dto.put("uploadedBy", resource.getUploadedBy());
                    dto.put("uploadedAt", resource.getUploadedAt());
                    dto.put("branch", resource.getBranch());
                    dto.put("subject", resource.getSubject());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resources", resourceDtos);
            responseData.put("count", resourceDtos.size());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resources retrieved successfully", responseData)
            );
        } catch (Exception e) {
            System.err.println("Error retrieving resources: " + e.getMessage());
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to retrieve resources", null)
            );
        }
    }

    @GetMapping("/my-resources")
    public ResponseEntity<ApiResponse> getMyResources(@RequestParam("userEmail") String userEmail) {
        try {
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            List<com.edusync.entity.Resource> resources = resourceRepository.findByUploadedByOrderByUploadedAtDesc(user.getId());
            
            // Convert to DTOs with proper structure
            List<Map<String, Object>> resourceDtos = resources.stream()
                .map(resource -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", resource.getId());
                    dto.put("title", resource.getTitle());
                    dto.put("description", resource.getDescription() != null ? resource.getDescription() : "");
                    dto.put("fileName", resource.getFileName());
                    dto.put("fileSize", resource.getFileSize());
                    dto.put("fileType", resource.getFileType());
                    dto.put("uploadedBy", resource.getUploadedBy());
                    dto.put("uploadedAt", resource.getUploadedAt());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resources", resourceDtos);
            responseData.put("count", resourceDtos.size());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resources retrieved successfully", responseData)
            );
        } catch (Exception e) {
            System.err.println("Error retrieving user resources: " + e.getMessage());
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to retrieve resources", null)
            );
        }
    }

    @GetMapping("/download/{resourceId}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResource(@PathVariable Long resourceId) {
        try {
            Optional<com.edusync.entity.Resource> resourceOpt = resourceRepository.findById(resourceId);
            if (!resourceOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            com.edusync.entity.Resource resource = resourceOpt.get();
            org.springframework.core.io.Resource fileResource = fileStorageService.loadResourceFileAsResource(resource.getFileName());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getTitle() + "\"")
                    .body(fileResource);
                    
        } catch (Exception e) {
            System.err.println("Error downloading resource: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewResource(@PathVariable Long id) {
        System.out.println("=== RESOURCE VIEW REQUEST ===");
        System.out.println("Resource ID: " + id);
        
        try {
            com.edusync.entity.Resource resource = resourceRepository.findById(id).orElse(null);
            if (resource == null) {
                System.out.println("Resource not found for ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Found resource: " + resource.getTitle());
            System.out.println("File name: " + resource.getFileName());

            // Get the file from storage
            org.springframework.core.io.Resource fileResource = fileStorageService.loadResourceFileAsResource(resource.getFileName());
            if (fileResource == null) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type based on file extension
            String contentType = determineContentType(resource.getFileName());
            
            // Read file bytes
            byte[] fileBytes = org.springframework.util.StreamUtils.copyToByteArray(fileResource.getInputStream());
            
            // Return file with appropriate content type for viewing
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(fileBytes.length);
            
            // For PDFs, allow inline viewing
            if (contentType.equals("application/pdf")) {
                headers.set("Content-Disposition", "inline; filename=\"" + resource.getFileName() + "\"");
            } else {
                headers.set("Content-Disposition", "inline; filename=\"" + resource.getFileName() + "\"");
            }
            
            return new ResponseEntity<>(fileBytes, headers, org.springframework.http.HttpStatus.OK);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to view resource: " + e.getMessage());
        }
    }

    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "pdf":
                return "application/pdf";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "mp4":
                return "video/mp4";
            case "avi":
                return "video/x-msvideo";
            case "mov":
                return "video/quicktime";
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls":
                return "application/vnd.ms-excel";
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "txt":
                return "text/plain";
            default:
                return "application/octet-stream";
        }
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<ApiResponse> deleteResource(
            @PathVariable Long resourceId,
            @RequestParam("userEmail") String userEmail) {
        try {
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "User not found", null)
                );
            }

            Optional<com.edusync.entity.Resource> resourceOpt = resourceRepository.findById(resourceId);
            if (!resourceOpt.isPresent()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Resource not found", null)
                );
            }

            com.edusync.entity.Resource resource = resourceOpt.get();
            
            // Check if user owns the resource
            if (!resource.getUploadedBy().equals(user.getId())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "You can only delete your own resources", null)
                );
            }

            // Delete file
            fileStorageService.deleteResourceFile(resource.getFileName());
            
            // Delete from database
            resourceRepository.delete(resource);

            return ResponseEntity.ok(
                new ApiResponse(true, "Resource deleted successfully", null)
            );
            
        } catch (Exception e) {
            System.err.println("Error deleting resource: " + e.getMessage());
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to delete resource", null)
            );
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse> getResources(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String subject) {
        try {
            List<Resource> resources;
            if (branch != null && !branch.equalsIgnoreCase("All")) {
                if (subject != null && !subject.isBlank()) {
                    resources = resourceRepository.findByBranchAndSubjectIgnoreCase(branch, subject);
                } else {
                    resources = resourceService.getResourcesByBranch(branch);
                }
            } else {
                resources = resourceService.getAllResources();
            }
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resources", resources);
            responseData.put("count", resources.size());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resources retrieved successfully", responseData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to retrieve resources", null)
            );
        }
    }

    @PostMapping("/{resourceId}/summarize")
    public ResponseEntity<ApiResponse> generateResourceSummary(@PathVariable Long resourceId) {
        try {
            System.out.println("=== GENERATING SUMMARY FOR RESOURCE ID: " + resourceId + " ===");
            
            // Check if resource exists
            Optional<Resource> resourceOpt = resourceRepository.findById(resourceId);
            if (!resourceOpt.isPresent()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Resource not found with ID: " + resourceId, null)
                );
            }

            Resource resource = resourceOpt.get();
            System.out.println("Found resource: " + resource.getTitle());
            System.out.println("File name: " + resource.getFileName());
            System.out.println("File type: " + resource.getFileType());
            
            // Generate summary using the SummaryService
            String summary = summaryService.generateResourceSummary(resourceId);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resourceId", resourceId);
            responseData.put("resourceTitle", resource.getTitle());
            responseData.put("summary", summary);
            responseData.put("summaryLength", summary.length());
            responseData.put("cohereConfigured", summaryService.isCohereConfigured());
            
            System.out.println("Summary generated successfully, length: " + summary.length());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Resource summary generated successfully", responseData)
            );
            
        } catch (Exception e) {
            System.err.println("Error generating summary for resource " + resourceId + ": " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to generate resource summary: " + e.getMessage(), null)
            );
        }
    }

    @GetMapping("/{resourceId}/summary-status")
    public ResponseEntity<ApiResponse> getSummaryStatus(@PathVariable Long resourceId) {
        try {
            Optional<Resource> resourceOpt = resourceRepository.findById(resourceId);
            if (!resourceOpt.isPresent()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Resource not found with ID: " + resourceId, null)
                );
            }

            Resource resource = resourceOpt.get();
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resourceId", resourceId);
            responseData.put("resourceTitle", resource.getTitle());
            responseData.put("fileName", resource.getFileName());
            responseData.put("fileType", resource.getFileType());
            responseData.put("cohereConfigured", summaryService.isCohereConfigured());
            responseData.put("canGenerateSummary", true);
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Summary status retrieved successfully", responseData)
            );
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to get summary status: " + e.getMessage(), null)
            );
        }
    }
}
