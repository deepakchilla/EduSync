package com.edusync.repository;

import com.edusync.entity.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {
    List<ChatThread> findByStudentIdOrderByLastMessageAtDesc(Long studentId);
    List<ChatThread> findByFacultyIdOrderByLastMessageAtDesc(Long facultyId);
}


