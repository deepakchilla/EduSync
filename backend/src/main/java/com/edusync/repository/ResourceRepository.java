package com.edusync.repository;

import com.edusync.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    // Find resources by uploaded user
    List<Resource> findByUploadedByOrderByUploadedAtDesc(Long uploadedBy);
    
    // Find all resources ordered by upload date (most recent first)
    List<Resource> findAllByOrderByUploadedAtDesc();
    
    // Find resources by file type
    List<Resource> findByFileTypeContainingIgnoreCaseOrderByUploadedAtDesc(String fileType);
    
    // Find by branch and optional subject
    List<Resource> findByBranchOrderByUploadedAtDesc(String branch);
    List<Resource> findByBranchAndSubjectOrderByUploadedAtDesc(String branch, String subject);

    // Search resources by title or description
    @Query("SELECT r FROM Resource r WHERE " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY r.uploadedAt DESC")
    List<Resource> searchByTitleOrDescription(@Param("searchTerm") String searchTerm);
    
    // Count resources by user
    long countByUploadedBy(Long uploadedBy);
}
