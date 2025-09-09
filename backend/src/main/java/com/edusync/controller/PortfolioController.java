package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.entity.Activity;
import com.edusync.entity.User;
import com.edusync.repository.UserRepository;
import com.edusync.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getPortfolio(@RequestParam("userEmail") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found", null));
            }
            List<Activity> activities = activityService.getMyActivities(userEmail);
            int approvedCount = (int) activities.stream().filter(a -> a.getStatus() == Activity.Status.APPROVED).count();
            int totalCredits = activities.stream()
                    .filter(a -> a.getStatus() == Activity.Status.APPROVED)
                    .map(a -> a.getCredits() == null ? 0 : a.getCredits())
                    .reduce(0, Integer::sum);

            Map<String, Object> profile = new HashMap<>();
            profile.put("user", user);
            profile.put("activities", activities);
            profile.put("approvedActivities", approvedCount);
            profile.put("totalCredits", totalCredits);

            return ResponseEntity.ok(new ApiResponse(true, "Portfolio summary generated", profile));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse(false, "Failed to generate portfolio", null));
        }
    }
}


