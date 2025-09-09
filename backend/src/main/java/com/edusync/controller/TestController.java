package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private SummaryService summaryService;

    @GetMapping("/cohere-config")
    public ResponseEntity<ApiResponse> testCohereConfig() {
        try {
            Map<String, Object> configData = new HashMap<>();
            configData.put("cohereConfigured", summaryService.isCohereConfigured());
            configData.put("message", summaryService.isCohereConfigured() ? 
                "Cohere API is properly configured" : 
                "Cohere API key is missing or not configured");
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Configuration check completed", configData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Configuration check failed: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping("/simple-summary")
    public ResponseEntity<ApiResponse> testSimpleSummary(@RequestBody Map<String, String> request) {
        try {
            String text = request.getOrDefault("text", "This is a test document about Python programming. Python is a high-level programming language known for its simplicity and readability.");
            
            String summary = summaryService.generateSummary(text);
            
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("originalText", text);
            responseData.put("summary", summary);
            responseData.put("summaryLength", summary.length());
            
            return ResponseEntity.ok(
                new ApiResponse(true, "Summary generated successfully", responseData)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Summary generation failed: " + e.getMessage(), null)
            );
        }
    }
}
