package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.entity.Activity;
import com.edusync.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitActivity(
            @RequestParam("userEmail") String userEmail,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "credits", required = false) Integer credits,
            @RequestParam(value = "certificate", required = false) MultipartFile certificate
    ) {
        try {
            Activity activity = new Activity();
            activity.setCategory(category);
            activity.setTitle(title);
            activity.setDescription(description);
            if (startDate != null && !startDate.isEmpty()) {
                activity.setStartDate(java.time.LocalDate.parse(startDate));
            }
            if (endDate != null && !endDate.isEmpty()) {
                activity.setEndDate(java.time.LocalDate.parse(endDate));
            }
            activity.setCredits(credits);

            Activity saved = activityService.submitActivity(activity, certificate, userEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("activity", saved);
            return ResponseEntity.ok(new ApiResponse(true, "Activity submitted for approval", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> myActivities(@RequestParam("userEmail") String userEmail) {
        try {
            List<Activity> list = activityService.getMyActivities(userEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("activities", list);
            return ResponseEntity.ok(new ApiResponse(true, "Fetched activities", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> pending() {
        List<Activity> list = activityService.getPendingActivities();
        Map<String, Object> data = new HashMap<>();
        data.put("activities", list);
        return ResponseEntity.ok(new ApiResponse(true, "Fetched pending activities", data));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approve(@PathVariable("id") Long id, @RequestParam("facultyEmail") String facultyEmail) {
        try {
            Activity updated = activityService.approveActivity(id, facultyEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("activity", updated);
            return ResponseEntity.ok(new ApiResponse(true, "Activity approved", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> reject(
            @PathVariable("id") Long id,
            @RequestParam("facultyEmail") String facultyEmail,
            @RequestParam("reason") String reason) {
        try {
            Activity updated = activityService.rejectActivity(id, facultyEmail, reason);
            Map<String, Object> data = new HashMap<>();
            data.put("activity", updated);
            return ResponseEntity.ok(new ApiResponse(true, "Activity rejected", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}


