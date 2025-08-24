package com.jsp.edusync.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "accessed_resources")
public class AccessedResource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "User ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotNull(message = "Resource ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;
    
    @Column(nullable = false)
    private LocalDateTime accessedAt;
    
    // Default constructor
    public AccessedResource() {
        this.accessedAt = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public AccessedResource(User user, Resource resource) {
        this.user = user;
        this.resource = resource;
        this.accessedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Resource getResource() {
        return resource;
    }
    
    public void setResource(Resource resource) {
        this.resource = resource;
    }
    
    public LocalDateTime getAccessedAt() {
        return accessedAt;
    }
    
    public void setAccessedAt(LocalDateTime accessedAt) {
        this.accessedAt = accessedAt;
    }
    
    @Override
    public String toString() {
        return "AccessedResource{" +
                "id=" + id +
                ", accessedAt=" + accessedAt +
                '}';
    }
}
