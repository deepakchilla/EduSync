package com.jsp.edusync.repositories;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    /**
     * Find all resources by faculty
     */
    List<Resource> findByFaculty(User faculty);
    
    /**
     * Find all resources by faculty ID
     */
    List<Resource> findByFacultyId(Long facultyId);
    
    /**
     * Find resources by title containing (case insensitive)
     */
    @Query("SELECT r FROM Resource r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Resource> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    /**
     * Find resources by file type
     */
    List<Resource> findByFileType(String fileType);
    
    /**
     * Find resources uploaded after a certain date
     */
    List<Resource> findByUploadDateAfter(LocalDateTime date);
    
    /**
     * Find resources uploaded between two dates
     */
    List<Resource> findByUploadDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find all resources ordered by upload date (newest first)
     */
    List<Resource> findAllByOrderByUploadDateDesc();
    
    /**
     * Count resources by faculty
     */
    long countByFaculty(User faculty);
    
    /**
     * Find resources by description containing keywords
     */
    @Query("SELECT r FROM Resource r WHERE LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Resource> findByDescriptionContainingIgnoreCase(@Param("keyword") String keyword);
}
