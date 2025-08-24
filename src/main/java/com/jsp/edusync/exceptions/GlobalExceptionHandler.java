package com.jsp.edusync.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("success", false);
        response.put("message", "Validation failed");
        response.put("errors", errors);
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle file upload size exceeded
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", "File size exceeds maximum limit of 50MB");
        
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
    }
    
    /**
     * Handle resource not found
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * Handle unauthorized access
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorizedException(UnauthorizedException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle forbidden access
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleForbiddenException(ForbiddenException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
    
    /**
     * Handle duplicate resource (like email already exists)
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResourceException(DuplicateResourceException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
    
    /**
     * Handle illegal argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle runtime exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        
        response.put("success", false);
        response.put("message", "An unexpected error occurred");
        response.put("details", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
