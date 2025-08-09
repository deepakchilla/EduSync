package com.jsp.edusync.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return false; // Email already exists
        }
        userRepository.save(user);
        return true;
    }

    public Optional<User> loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }

    public User authenticate(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }

}
