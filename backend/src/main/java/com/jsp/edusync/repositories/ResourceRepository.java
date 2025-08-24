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
    
    List<Resource> findByUploadedBy(User uploadedBy);
    
    List<Resource> findByUploadedById(Long uploadedById);
    
    @Query("SELECT r FROM Resource r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Resource> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    List<Resource> findByFileType(String fileType);
    
    List<Resource> findByUploadedAtAfter(LocalDateTime date);
    
    List<Resource> findByUploadedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Resource> findAllByOrderByUploadedAtDesc();
    
    long countByUploadedBy(User uploadedBy);
    
    @Query("SELECT r FROM Resource r WHERE LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Resource> findByDescriptionContainingIgnoreCase(@Param("keyword") String keyword);
}
