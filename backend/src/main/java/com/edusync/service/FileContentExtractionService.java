package com.edusync.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileContentExtractionService {

    private final Tika tika = new Tika();
    private final AutoDetectParser parser = new AutoDetectParser();

    /**
     * Extract text content from a file
     */
    public String extractTextFromFile(String filePath) throws Exception {
        try {
            Path path = Paths.get(filePath);
            
            if (!Files.exists(path)) {
                throw new FileNotFoundException("File not found: " + filePath);
            }

            // Use Tika to extract text content
            return extractTextWithTika(path);
            
        } catch (Exception e) {
            System.err.println("Error extracting text from file: " + filePath + " - " + e.getMessage());
            throw new Exception("Failed to extract text from file: " + e.getMessage());
        }
    }

    /**
     * Extract text content from a file using Apache Tika
     */
    private String extractTextWithTika(Path filePath) throws Exception {
        try (InputStream inputStream = Files.newInputStream(filePath)) {
            
            // Create a content handler to extract text
            BodyContentHandler handler = new BodyContentHandler(10 * 1024 * 1024); // 10MB limit
            
            // Create metadata object
            Metadata metadata = new Metadata();
            
            // Create parse context
            ParseContext parseContext = new ParseContext();
            parseContext.set(Parser.class, parser);
            
            // Parse the document
            parser.parse(inputStream, handler, metadata, parseContext);
            
            // Get the extracted text
            String extractedText = handler.toString();
            
            if (extractedText == null || extractedText.trim().isEmpty()) {
                throw new Exception("No text content could be extracted from the file");
            }
            
            // Clean up the text
            return cleanExtractedText(extractedText);
            
        } catch (IOException | SAXException | TikaException e) {
            throw new Exception("Error parsing file with Tika: " + e.getMessage());
        }
    }

    /**
     * Clean and format the extracted text
     */
    private String cleanExtractedText(String text) {
        if (text == null) {
            return "";
        }
        
        // Remove excessive whitespace and normalize line breaks
        String cleaned = text
            .replaceAll("\\s+", " ")  // Replace multiple whitespace with single space
            .replaceAll("\\n\\s*\\n", "\n\n")  // Normalize paragraph breaks
            .trim();
        
        // Limit the text length to avoid token limits
        int maxLength = 8000; // Conservative limit for API calls
        if (cleaned.length() > maxLength) {
            cleaned = cleaned.substring(0, maxLength) + "...";
        }
        
        return cleaned;
    }

    /**
     * Get file type information
     */
    public String detectFileType(String filePath) throws Exception {
        try {
            Path path = Paths.get(filePath);
            if (!Files.exists(path)) {
                throw new FileNotFoundException("File not found: " + filePath);
            }
            
            return tika.detect(path);
        } catch (Exception e) {
            throw new Exception("Error detecting file type: " + e.getMessage());
        }
    }

    /**
     * Check if file type is supported for text extraction
     */
    public boolean isSupportedFileType(String filePath) {
        try {
            String mimeType = detectFileType(filePath);
            
            // List of supported MIME types for text extraction
            return mimeType != null && (
                mimeType.startsWith("text/") ||
                mimeType.equals("application/pdf") ||
                mimeType.equals("application/msword") ||
                mimeType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                mimeType.equals("application/vnd.ms-excel") ||
                mimeType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                mimeType.equals("application/vnd.ms-powerpoint") ||
                mimeType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation") ||
                mimeType.equals("application/rtf") ||
                mimeType.equals("application/x-rtf") ||
                mimeType.equals("text/rtf")
            );
        } catch (Exception e) {
            System.err.println("Error checking file type support: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extract text with fallback methods
     */
    public String extractTextWithFallback(String filePath) throws Exception {
        try {
            // First try with Tika
            return extractTextFromFile(filePath);
        } catch (Exception e) {
            System.err.println("Tika extraction failed, trying fallback methods: " + e.getMessage());
            
            // Fallback: try to read as plain text
            try {
                return extractAsPlainText(filePath);
            } catch (Exception e2) {
                throw new Exception("All text extraction methods failed. Original error: " + e.getMessage() + 
                                 ", Fallback error: " + e2.getMessage());
            }
        }
    }

    /**
     * Fallback method to read file as plain text
     */
    private String extractAsPlainText(String filePath) throws Exception {
        try {
            Path path = Paths.get(filePath);
            byte[] bytes = Files.readAllBytes(path);
            
            // Try to detect encoding and convert to string
            String content = new String(bytes, "UTF-8");
            
            // If the content looks like binary data, it's probably not a text file
            if (content.contains("\0") || content.length() != bytes.length) {
                throw new Exception("File appears to be binary and cannot be read as text");
            }
            
            return cleanExtractedText(content);
            
        } catch (Exception e) {
            throw new Exception("Failed to read file as plain text: " + e.getMessage());
        }
    }
}
