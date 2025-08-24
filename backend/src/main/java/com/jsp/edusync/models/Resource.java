package com.jsp.edusync.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 200, message = "Title must be between 2 and 200 characters")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    @Column(nullable = false, length = 1000)
    private String description;
    
    @NotBlank(message = "File name is required")
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String fileType;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] fileData;
    
    @NotNull(message = "Faculty ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    @Column(nullable = false)
    private LocalDateTime lastModified;
    
    // Default constructor
    public Resource() {
        this.uploadedAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public Resource(String title, String description, String fileName, String fileType, 
                   Long fileSize, byte[] fileData, User uploadedBy) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.fileData = fileData;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
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
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public byte[] getFileData() {
        return fileData;
    }
    
    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }
    
    public User getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public LocalDateTime getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }
    
    @Override
    public String toString() {
        return "Resource{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize=" + fileSize +
                ", uploadedAt=" + uploadedAt +
                ", lastModified=" + lastModified +
                '}';
    }
}
