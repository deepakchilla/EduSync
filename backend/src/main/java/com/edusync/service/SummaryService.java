package com.edusync.service;

import com.edusync.entity.Resource;
import com.edusync.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SummaryService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Value("${cohere.api.key:}")
    private String cohereApiKey;

    @Value("${cohere.api.base-url:https://api.cohere.ai/v1}")
    private String cohereApiBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate a standard summary using Cohere API
     */
    public String generateSummary(String text) throws Exception {
        return callCohereApi(text, 500, 0.3);
    }

    /**
     * Generate a quick summary using Cohere API
     */
    public String generateQuickSummary(String text) throws Exception {
        return callCohereApi(text, 200, 0.2);
    }

    /**
     * Generate a detailed summary using Cohere API
     */
    public String generateDetailedSummary(String text) throws Exception {
        return callCohereApi(text, 800, 0.4);
    }

    /**
     * Generate summary for a specific resource
     */
    public String generateResourceSummary(Long resourceId) throws Exception {
        Optional<Resource> resourceOpt = resourceRepository.findById(resourceId);
        if (!resourceOpt.isPresent()) {
            throw new Exception("Resource not found with ID: " + resourceId);
        }

        Resource resource = resourceOpt.get();
        
        // For now, we'll use the title and description as the text to summarize
        // In a real implementation, you might want to extract text from the actual file
        String textToSummarize = resource.getTitle() + "\n\n" + 
                                (resource.getDescription() != null ? resource.getDescription() : "");
        
        if (textToSummarize.trim().isEmpty()) {
            throw new Exception("No content available to summarize for this resource");
        }

        return generateSummary(textToSummarize);
    }

    /**
     * Check if Cohere API is configured
     */
    public boolean isCohereConfigured() {
        return cohereApiKey != null && !cohereApiKey.trim().isEmpty();
    }

    /**
     * Call Cohere API to generate summary
     */
    private String callCohereApi(String text, int maxTokens, double temperature) throws Exception {
        if (!isCohereConfigured()) {
            throw new Exception("Cohere API key is not configured");
        }

        try {
            // Truncate text if it's too long (Cohere has token limits)
            int maxInputLength = 4000; // Approximate token limit
            String truncatedText = text.length() > maxInputLength 
                ? text.substring(0, maxInputLength) + "..." 
                : text;

            String prompt = "Please provide a comprehensive summary of the following educational material. " +
                           "Focus on key concepts, main points, and important details that would help students " +
                           "understand the content:\n\n" + truncatedText + "\n\nSummary:";

            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "command");
            requestBody.put("prompt", prompt);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", temperature);
            requestBody.put("k", 0);
            requestBody.put("p", 0.75);
            requestBody.put("frequency_penalty", 0.0);
            requestBody.put("presence_penalty", 0.0);
            requestBody.put("stop_sequences", new String[]{"---", "\n\n---"});

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + cohereApiKey);
            headers.set("Accept", "application/json");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Make API call
            String url = cohereApiBaseUrl + "/generate";
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                request, 
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                
                // Extract the generated text from the response
                if (responseBody.containsKey("generations")) {
                    Object generations = responseBody.get("generations");
                    if (generations instanceof java.util.List) {
                        java.util.List<?> genList = (java.util.List<?>) generations;
                        if (!genList.isEmpty()) {
                            Object firstGen = genList.get(0);
                            if (firstGen instanceof Map) {
                                Map<?, ?> genMap = (Map<?, ?>) firstGen;
                                if (genMap.containsKey("text")) {
                                    String summary = (String) genMap.get("text");
                                    return summary != null ? summary.trim() : "";
                                }
                            }
                        }
                    }
                }
                
                throw new Exception("Invalid response format from Cohere API");
            } else {
                throw new Exception("Unexpected response from Cohere API: " + response.getStatusCode());
            }

        } catch (HttpClientErrorException e) {
            // Handle 4xx errors
            String errorMessage = "Client error from Cohere API: " + e.getStatusCode();
            if (e.getResponseBodyAsString() != null) {
                errorMessage += " - " + e.getResponseBodyAsString();
            }
            throw new Exception(errorMessage);
            
        } catch (HttpServerErrorException e) {
            // Handle 5xx errors
            String errorMessage = "Server error from Cohere API: " + e.getStatusCode();
            if (e.getResponseBodyAsString() != null) {
                errorMessage += " - " + e.getResponseBodyAsString();
            }
            throw new Exception(errorMessage);
            
        } catch (Exception e) {
            if (e.getMessage().contains("Cohere API")) {
                throw e; // Re-throw Cohere-specific errors
            } else {
                throw new Exception("Error calling Cohere API: " + e.getMessage());
            }
        }
    }
}
