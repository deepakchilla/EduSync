package com.jsp.edusync.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String titleTerm, String descriptionTerm);
    List<Resource> findByUploader(User uploader);
}
