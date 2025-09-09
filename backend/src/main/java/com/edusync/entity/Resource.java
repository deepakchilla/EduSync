package com.edusync.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "resources")
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(nullable = false)
    private String title;
    
    @Size(max = 1000, message = "Description must be less than 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank(message = "File name is required")
    @Size(max = 255, message = "File name must be less than 255 characters")
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @NotNull(message = "File size is required")
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @NotBlank(message = "File type is required")
    @Size(max = 100, message = "File type must be less than 100 characters")
    @Column(name = "file_type", nullable = false)
    private String fileType;
    
    @NotNull(message = "Uploaded by is required")
    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;
    
    @Column(name = "upload_date", updatable = false)
    private LocalDateTime uploadedAt;

    // ✅ New Branch field
    @NotBlank(message = "Branch is required")
    @Size(max = 100, message = "Branch must be less than 100 characters")
    @Column(nullable = false)
    private String branch;
    
    // Default constructor
    public Resource() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public Resource(String title, String description, String fileName, Long fileSize, String fileType, Long uploadedBy) {
        this();
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.uploadedBy = uploadedBy;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    public String getBranch() {
        return branch;
    }
    public void setBranch(String branch) {
        this.branch = branch;
    }
}
