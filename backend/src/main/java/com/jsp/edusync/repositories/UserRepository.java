package com.jsp.edusync.repositories;

import com.jsp.edusync.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndPassword(String email, String password);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    long countByRole(User.Role role);
}
