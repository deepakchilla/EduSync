package com.jsp.edusync.repositories;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.models.ViewedResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ViewedResourceRepository extends JpaRepository<ViewedResource, Long> {
    
    /**
     * Find all viewed resources by student
     */
    List<ViewedResource> findByStudent(User student);
    
    /**
     * Find all viewed resources by student ID
     */
    List<ViewedResource> findByStudentId(Long studentId);
    
    /**
     * Find all viewed resources by student ordered by viewed date (newest first)
     */
    List<ViewedResource> findByStudentOrderByViewedDateDesc(User student);
    
    /**
     * Find viewed resource by student and resource
     */
    Optional<ViewedResource> findByStudentAndResource(User student, Resource resource);
    
    /**
     * Find all viewed resources by access type
     */
    List<ViewedResource> findByAccessType(ViewedResource.AccessType accessType);
    
    /**
     * Find all viewed resources by student and access type
     */
    List<ViewedResource> findByStudentAndAccessType(User student, ViewedResource.AccessType accessType);
    
    /**
     * Find viewed resources by student and date range
     */
    List<ViewedResource> findByStudentAndViewedDateBetween(User student, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Check if student has accessed a resource
     */
    boolean existsByStudentAndResource(User student, Resource resource);
    
    /**
     * Count viewed resources by student
     */
    long countByStudent(User student);
    
    /**
     * Count how many times a resource has been accessed
     */
    long countByResource(Resource resource);
    
    /**
     * Get distinct resources accessed by a student
     */
    @Query("SELECT DISTINCT vr.resource FROM ViewedResource vr WHERE vr.student = :student ORDER BY vr.viewedDate DESC")
    List<Resource> findDistinctResourcesByStudent(@Param("student") User student);
}
