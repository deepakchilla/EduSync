package com.jsp.edusync.repositories;

import com.jsp.edusync.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by email and password for authentication
     */
    Optional<User> findByEmailAndPassword(String email, String password);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users by role
     */
    List<User> findByRole(User.Role role);
    
    /**
     * Find users by name containing (case insensitive)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Count users by role
     */
    long countByRole(User.Role role);
}
