package com.jsp.edusync.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String fileName;        // ← new
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadTime;
    private byte[] fileData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id")
    private User uploader;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;

    public Resource() { }

    public Resource(String title,
                    String description,
                    String fileName,
                    String fileType,
                    Long fileSize,
                    LocalDateTime uploadTime,
                    byte[] data,
                    User uploader) {
        this.title       = title;
        this.description = description;
        this.fileName    = fileName;
        this.fileType    = fileType;
        this.fileSize    = fileSize;
        this.uploadTime  = uploadTime;
        this.data        = data;
        this.uploader    = uploader;
    }

    // — Getters & setters —

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileName() { return fileName; }       // ← new
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public void setFileData(byte[] fileData) { this.fileData = fileData; }
    public byte[] getFileData() { return fileData; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public LocalDateTime getUploadTime() { return uploadTime; }
    public void setUploadTime(LocalDateTime uploadTime) { this.uploadTime = uploadTime; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
}
