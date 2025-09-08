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
@RequestMapping("/certifications")
public class CertificationController {

    @Autowired
    private ActivityService activityService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> upload(
            @RequestParam("userEmail") String userEmail,
            @RequestParam("type") String type,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Activity a = new Activity();
            a.setCategory(type.equalsIgnoreCase("INTERNSHIP") ? "CERT_INTERNSHIP" : "CERT_COURSE");
            a.setTitle(title);
            a.setDescription(description);
            if (startDate != null && !startDate.isEmpty()) {
                a.setStartDate(java.time.LocalDate.parse(startDate));
            }
            if (endDate != null && !endDate.isEmpty()) {
                a.setEndDate(java.time.LocalDate.parse(endDate));
            }
            Activity saved = activityService.submitCertification(a, file, userEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("certification", saved);
            return ResponseEntity.ok(new ApiResponse(true, "Certification saved", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> my(@RequestParam("userEmail") String userEmail) {
        try {
            List<Activity> list = activityService.getMyCertifications(userEmail);
            Map<String, Object> data = new HashMap<>();
            data.put("certifications", list);
            return ResponseEntity.ok(new ApiResponse(true, "Fetched certifications", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id, @RequestParam("userEmail") String userEmail) {
        try {
            activityService.deleteMyCertification(id, userEmail);
            return ResponseEntity.ok(new ApiResponse(true, "Deleted certification", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}


