package com.jsp.edusync.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.jsp.edusync.models.Resource;
import com.jsp.edusync.models.User;
import com.jsp.edusync.repositories.UserRepository;
import com.jsp.edusync.services.AuthService;
import com.jsp.edusync.services.ResourceService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {

    private final AuthService authService;
    private final ResourceService resourceService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthService authService, ResourceService resourceService, UserRepository userRepository) {
        this.authService = authService;
        this.resourceService = resourceService;
        this.userRepository = userRepository;
    }

    // Root redirect
    @GetMapping("/")
    public String root() {
        return "redirect:/welcome";
    }

    // Welcome page
    @GetMapping("/welcome")
    public String showWelcomePage(Model model) {
        List<Resource> resources = resourceService.getAllResources();
        model.addAttribute("resources", resources);
        return "welcome";
    }

    // Login
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/login")
    public String handleLogin(@RequestParam String email,
                            @RequestParam String password,
                            Model model,
                            HttpSession session) {
        System.out.println("Login attempt: " + email + " / " + password);

        User user = authService.authenticate(email, password);
        if (user == null) {
            System.out.println("Auth failed: Invalid credentials");
            model.addAttribute("error", "Invalid credentials");
            return "login";
        }

        System.out.println("Auth successful: " + user.getRole());
        session.setAttribute("loggedInUser", user);
        return user.getRole().equalsIgnoreCase("faculty") ? "redirect:/home" : "redirect:/student-home";
    }

    // Signup
    @GetMapping("/signup")
    public String showSignupPage(Model model) {
        model.addAttribute("user", new User());
        return "signup";
    }

    @PostMapping("/signup")
    public String handleSignup(@ModelAttribute User user, Model model, HttpSession session) {
        if (!authService.registerUser(user)) {
            model.addAttribute("error", "Email already registered");
            return "signup";
        }
        session.setAttribute("loggedInUser", user);
        return "redirect:/home";
    }

    // Logout
    @GetMapping("/logout")
    public String handleLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // Home Pages
    @GetMapping("/home")
    public String showHomePage(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }

        List<Resource> resources = resourceService.getAllResources();
        model.addAttribute("user", user);
        model.addAttribute("resources", resources);
        return "home";
    }

    @GetMapping("/student-home")
    public String showStudentHome(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("student")) {
            return "redirect:/login";
        }

        List<Resource> resources = resourceService.getAllResources();
        model.addAttribute("user", user);
        model.addAttribute("resources", resources);
        model.addAttribute("studentName", user.getName());
        return "student-home";
    }

    // Search
    @GetMapping("/search")
    public String handleSearch(@RequestParam(required = false) String query, Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }
        
        // If query is null, empty, or just whitespace, redirect to home
        if (query == null || query.trim().isEmpty()) {
            return "redirect:/home";
        }
        
        List<Resource> searchResults = resourceService.searchResources(query.trim());
        model.addAttribute("user", user);
        model.addAttribute("resources", searchResults);
        model.addAttribute("searchQuery", query);
        
        return user.getRole().equalsIgnoreCase("faculty") ? "home" : "student-home";
    }

    // Resource Management
    @GetMapping("/upload")
    public String showUploadPage(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("faculty")) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "upload";
    }

    @PostMapping("/upload")
    public String handleUpload(@RequestParam String title,
                             @RequestParam String description,
                             @RequestParam("file") MultipartFile file,
                             HttpSession session) throws IOException {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("faculty")) {
            return "redirect:/login";
        }

        resourceService.saveResource(
            title,
            description,
            file.getOriginalFilename(),
            file.getContentType(),
            file.getSize(),
            file.getBytes(),
            user
        );
        return "redirect:/home";
    }

    @GetMapping("/download/{id}")
    public void handleDownload(@PathVariable Long id, HttpServletResponse response) throws IOException {
        Optional<Resource> resource = resourceService.getResourceById(id);
        if (resource.isPresent()) {
            Resource r = resource.get();
            response.setContentType(r.getFileType());
            response.setHeader("Content-Disposition", "attachment; filename=\"" + r.getFileName() + "\"");
            response.getOutputStream().write(r.getData());
            response.flushBuffer();
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @GetMapping("/edit/{id}")
    public String showEditPage(@PathVariable Long id, Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("faculty")) {
            return "redirect:/login";
        }

        Optional<Resource> resource = resourceService.getResourceById(id);
        if (resource.isEmpty()) {
            return "redirect:/home";
        }

        model.addAttribute("user", user);
        model.addAttribute("resource", resource.get());
        return "edit";
    }

    @PostMapping("/update")
    public String handleUpdate(@RequestParam Long id,
                             @RequestParam String title,
                             @RequestParam String description,
                             HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("faculty")) {
            return "redirect:/login";
        }

        resourceService.updateResource(id, title, description);
        return "redirect:/home";
    }

    @GetMapping("/delete/{id}")
    public String handleDelete(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null || !user.getRole().equalsIgnoreCase("faculty")) {
            return "redirect:/login";
        }

        resourceService.deleteResource(id);
        return "redirect:/home";
    }

    // Profile
    @GetMapping("/profile")
    public String showProfile(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }
        
        model.addAttribute("user", user);
        
        // If faculty, get their uploaded resources
        if ("faculty".equals(user.getRole())) {
            List<Resource> resources = resourceService.getResourcesByUploader(user);
            model.addAttribute("resources", resources);
        }
        
        return "profile";
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestParam String name, 
                              @RequestParam String email,
                              @RequestParam(required = false) MultipartFile profilePicture,
                              HttpSession session) throws IOException {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body(Map.of("message", "User not logged in"));
        }

        // Update user details
        user.setName(name);
        user.setEmail(email);
        
        // Update profile picture if provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            user.setProfilePicture(profilePicture.getBytes());
            user.setProfilePictureType(profilePicture.getContentType());
        }
        
        // Save to database
        userRepository.save(user);
        
        // Update session
        session.setAttribute("loggedInUser", user);
        
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @GetMapping("/profile-picture/{id}")
    public void getProfilePicture(@PathVariable Long id, HttpServletResponse response) throws IOException {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent() && user.get().getProfilePicture() != null) {
            User u = user.get();
            response.setContentType(u.getProfilePictureType());
            response.getOutputStream().write(u.getProfilePicture());
            response.flushBuffer();
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @PostMapping("/delete-profile-picture")
    public ResponseEntity<?> deleteProfilePicture(HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                               .body(Map.of("message", "User not logged in"));
        }
        
        // Remove profile picture
        user.setProfilePicture(null);
        user.setProfilePictureType(null);
        
        // Save to database
        userRepository.save(user);
        
        // Update session
        session.setAttribute("loggedInUser", user);
        
        return ResponseEntity.ok(Map.of("message", "Profile picture removed successfully"));
    }
}
