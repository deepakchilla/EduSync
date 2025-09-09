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

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SummaryService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private FileContentExtractionService fileContentExtractionService;

    @Value("${cohere.api.key:}")
    private String cohereApiKey;

    @Value("${cohere.api.base-url:https://api.cohere.ai/v1}")
    private String cohereApiBaseUrl;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

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
     * Generate summary for a specific resource by extracting actual file content
     */
    public String generateResourceSummary(Long resourceId) throws Exception {
        Optional<Resource> resourceOpt = resourceRepository.findById(resourceId);
        if (!resourceOpt.isPresent()) {
            throw new Exception("Resource not found with ID: " + resourceId);
        }

        Resource resource = resourceOpt.get();
        
        try {
            // Try to extract content from the actual file
            String fileContent = extractFileContent(resource);
            
            if (fileContent != null && !fileContent.trim().isEmpty()) {
                // Check if Cohere API is configured
                if (isCohereConfigured()) {
                    // Use the extracted file content for AI summarization
                    return generateSummary(fileContent);
                } else {
                    // If no API key, return a basic summary of the extracted content
                    return createBasicSummaryFromContent(fileContent, resource);
                }
            } else {
                // Fallback to title and description if file content extraction fails
                String fallbackText = createFallbackText(resource);
                if (isCohereConfigured()) {
                    return generateSummary(fallbackText);
                } else {
                    return createBasicSummaryFromContent(fallbackText, resource);
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error extracting file content for resource " + resourceId + ": " + e.getMessage());
            
            // Fallback to title and description
            String fallbackText = createFallbackText(resource);
            if (isCohereConfigured()) {
                return generateSummary(fallbackText);
            } else {
                return createBasicSummaryFromContent(fallbackText, resource);
            }
        }
    }

    /**
     * Extract content from the actual uploaded file
     */
    private String extractFileContent(Resource resource) throws Exception {
        try {
            // Construct the file path
            Path filePath = Paths.get(uploadDir, "resources", resource.getFileName());
            
            System.out.println("Attempting to extract content from file: " + filePath.toString());
            
            // Check if file exists
            if (!filePath.toFile().exists()) {
                throw new Exception("File not found: " + filePath.toString());
            }
            
            // Check if file type is supported
            if (!fileContentExtractionService.isSupportedFileType(filePath.toString())) {
                throw new Exception("File type not supported for text extraction: " + resource.getFileType());
            }
            
            // Extract text content
            String extractedText = fileContentExtractionService.extractTextWithFallback(filePath.toString());
            
            if (extractedText == null || extractedText.trim().isEmpty()) {
                throw new Exception("No text content could be extracted from the file");
            }
            
            System.out.println("Successfully extracted " + extractedText.length() + " characters from file");
            return extractedText;
            
        } catch (Exception e) {
            System.err.println("Failed to extract file content: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Create fallback text from title and description
     */
    private String createFallbackText(Resource resource) {
        StringBuilder fallbackText = new StringBuilder();
        
        // Add title
        if (resource.getTitle() != null && !resource.getTitle().trim().isEmpty()) {
            fallbackText.append("Title: ").append(resource.getTitle()).append("\n\n");
        }
        
        // Add description
        if (resource.getDescription() != null && !resource.getDescription().trim().isEmpty()) {
            fallbackText.append("Description: ").append(resource.getDescription()).append("\n\n");
        }
        
        // Add file type information
        if (resource.getFileType() != null) {
            fallbackText.append("File Type: ").append(resource.getFileType()).append("\n\n");
        }
        
        // Add a note that this is based on metadata only
        fallbackText.append("Note: This summary is based on the resource metadata only, as the file content could not be extracted.");
        
        return fallbackText.toString();
    }

    /**
     * Create a basic summary from extracted content when Cohere API is not available
     */
    private String createBasicSummaryFromContent(String content, Resource resource) {
        StringBuilder summary = new StringBuilder();
        
        summary.append("📚 **Content Summary**\n\n");
        
        // Add resource info
        if (resource.getTitle() != null) {
            summary.append("**Title:** ").append(resource.getTitle()).append("\n\n");
        }
        
        // Extract first few sentences as a basic summary
        String[] sentences = content.split("[.!?]+");
        int maxSentences = Math.min(3, sentences.length);
        
        summary.append("**Key Content:**\n");
        for (int i = 0; i < maxSentences; i++) {
            String sentence = sentences[i].trim();
            if (!sentence.isEmpty() && sentence.length() > 10) {
                summary.append("• ").append(sentence).append(".\n");
            }
        }
        
        summary.append("\n**File Information:**\n");
        summary.append("• File Type: ").append(resource.getFileType() != null ? resource.getFileType() : "Unknown").append("\n");
        summary.append("• Content Length: ").append(content.length()).append(" characters\n");
        
        summary.append("\n*Note: This is a basic summary. For AI-powered analysis, please configure the Cohere API key.*");
        
        return summary.toString();
    }

    /**
     * Check if Cohere API is configured
     */
    public boolean isCohereConfigured() {
        return cohereApiKey != null && !cohereApiKey.trim().isEmpty();
    }

    /**
     * Test method to extract file content without generating summary
     */
    public String testFileContentExtraction(Long resourceId) throws Exception {
        Optional<Resource> resourceOpt = resourceRepository.findById(resourceId);
        if (!resourceOpt.isPresent()) {
            throw new Exception("Resource not found with ID: " + resourceId);
        }

        Resource resource = resourceOpt.get();
        return extractFileContent(resource);
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

            String prompt = "Please provide a comprehensive educational summary of the following material. " +
                           "Focus on:\n" +
                           "1. Key concepts and definitions\n" +
                           "2. Main topics and themes\n" +
                           "3. Important examples and applications\n" +
                           "4. Learning objectives and takeaways\n" +
                           "5. Practical insights for students\n\n" +
                           "Make the summary educational and informative, helping students understand what they will learn from this material:\n\n" + 
                           truncatedText + "\n\nEducational Summary:";

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
