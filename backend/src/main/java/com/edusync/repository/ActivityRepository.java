package com.edusync.repository;

import com.edusync.entity.Activity;
import com.edusync.entity.Activity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Activity> findByStatusOrderByCreatedAtDesc(Status status);
    List<Activity> findByStudentIdAndCategoryInOrderByCreatedAtDesc(Long studentId, List<String> categories);
}


