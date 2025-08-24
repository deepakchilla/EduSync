package com.jsp.edusync.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "viewed_resources")
public class ViewedResource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @NotNull(message = "Resource ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;
    
    @Column(nullable = false)
    private LocalDateTime viewedDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessType accessType;
    
    public enum AccessType {
        VIEWED, DOWNLOADED
    }
    
    // Default constructor
    public ViewedResource() {
        this.viewedDate = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public ViewedResource(User student, Resource resource, AccessType accessType) {
        this.student = student;
        this.resource = resource;
        this.accessType = accessType;
        this.viewedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getStudent() {
        return student;
    }
    
    public void setStudent(User student) {
        this.student = student;
    }
    
    public Resource getResource() {
        return resource;
    }
    
    public void setResource(Resource resource) {
        this.resource = resource;
    }
    
    public LocalDateTime getViewedDate() {
        return viewedDate;
    }
    
    public void setViewedDate(LocalDateTime viewedDate) {
        this.viewedDate = viewedDate;
    }
    
    public AccessType getAccessType() {
        return accessType;
    }
    
    public void setAccessType(AccessType accessType) {
        this.accessType = accessType;
    }
    
    @Override
    public String toString() {
        return "ViewedResource{" +
                "id=" + id +
                ", viewedDate=" + viewedDate +
                ", accessType=" + accessType +
                '}';
    }
}
