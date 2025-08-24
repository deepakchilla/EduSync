package com.jsp.edusync.repositories;

import com.jsp.edusync.models.AccessedResource;
import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessedResourceRepository extends JpaRepository<AccessedResource, Long> {
    
    List<AccessedResource> findByUser(User user);
    
    List<AccessedResource> findByUserId(Long userId);
    
    List<AccessedResource> findByUserOrderByAccessedAtDesc(User user);
    
    Optional<AccessedResource> findByUserAndResource(User user, Resource resource);
    
    List<AccessedResource> findByUserAndAccessedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    
    boolean existsByUserAndResource(User user, Resource resource);
    
    long countByUser(User user);
    
    long countByResource(Resource resource);
    
    @Query("SELECT DISTINCT ar.resource FROM AccessedResource ar WHERE ar.user = :user ORDER BY ar.accessedAt DESC")
    List<Resource> findDistinctResourcesByUserOrderByAccessedAtDesc(@Param("user") User user);
    
    @Query("SELECT ar FROM AccessedResource ar WHERE ar.user = :user ORDER BY ar.accessedAt DESC")
    List<AccessedResource> findTop5ByUserOrderByAccessedAtDesc(@Param("user") User user);
}
