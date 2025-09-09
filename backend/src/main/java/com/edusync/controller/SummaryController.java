package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse> generateSummary(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            String type = request.getOrDefault("type", "standard"); // standard, quick, detailed
            
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Text content is required", null)
                );
            }

            String summary;
            switch (type.toLowerCase()) {
                case "quick":
                    summary = summaryService.generateQuickSummary(text);
                    break;
                case "detailed":
                    summary = summaryService.generateDetailedSummary(text);
                    break;
                default:
                    summary = summaryService.generateSummary(text);
                    break;
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("summary", summary);
            responseData.put("type", type);
            responseData.put("originalLength", text.length());
            responseData.put("summaryLength", summary.length());

            return ResponseEntity.ok(
                new ApiResponse(true, "Summary generated successfully", responseData)
            );

        } catch (Exception e) {
            System.err.println("Error generating summary: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to generate summary: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping("/resource/{resourceId}")
    public ResponseEntity<ApiResponse> generateResourceSummary(@PathVariable Long resourceId) {
        try {
            String summary = summaryService.generateResourceSummary(resourceId);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("summary", summary);
            responseData.put("resourceId", resourceId);

            return ResponseEntity.ok(
                new ApiResponse(true, "Resource summary generated successfully", responseData)
            );

        } catch (Exception e) {
            System.err.println("Error generating resource summary: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to generate resource summary: " + e.getMessage(), null)
            );
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> healthCheck() {
        try {
            Map<String, Object> healthData = new HashMap<>();
            healthData.put("status", "healthy");
            healthData.put("cohereConfigured", summaryService.isCohereConfigured());
            healthData.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Summary service is healthy", healthData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Summary service health check failed: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping("/test-extraction/{resourceId}")
    public ResponseEntity<ApiResponse> testContentExtraction(@PathVariable Long resourceId) {
        try {
            // This endpoint is for testing file content extraction
            String extractedContent = summaryService.testFileContentExtraction(resourceId);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("resourceId", resourceId);
            responseData.put("extractedContent", extractedContent);
            responseData.put("contentLength", extractedContent.length());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Content extraction test successful", responseData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Content extraction test failed: " + e.getMessage(), null)
            );
        }
    }
}
