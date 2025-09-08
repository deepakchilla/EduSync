package com.edusync.service;

import com.edusync.entity.Activity;
import com.edusync.entity.Activity.Status;
import com.edusync.entity.User;
import com.edusync.repository.ActivityRepository;
import com.edusync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Activity submitActivity(Activity activity, MultipartFile certificate, String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) throw new Exception("User not found");
        if (user.getRole() != User.UserRole.STUDENT) throw new Exception("Only students can submit activities");

        activity.setStudentId(user.getId());
        activity.setStatus(Status.PENDING);
        if (certificate != null && !certificate.isEmpty()) {
            String stored = fileStorageService.storeResourceFile(certificate);
            activity.setCertificateFile(stored);
        }
        return activityRepository.save(activity);
    }

    public List<Activity> getMyActivities(String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) throw new Exception("User not found");
        return activityRepository.findByStudentIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Activity> getPendingActivities() {
        return activityRepository.findByStatusOrderByCreatedAtDesc(Status.PENDING);
    }

    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }

    public Activity approveActivity(Long id, String facultyEmail) throws Exception {
        User faculty = userRepository.findByEmail(facultyEmail).orElse(null);
        if (faculty == null || faculty.getRole() != User.UserRole.FACULTY) {
            throw new Exception("Only faculty can approve activities");
        }
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new Exception("Activity not found"));
        activity.setStatus(Status.APPROVED);
        activity.setApprovedBy(faculty.getId());
        activity.setApprovedAt(LocalDateTime.now());
        activity.setRejectionReason(null);
        return activityRepository.save(activity);
    }

    public Activity rejectActivity(Long id, String facultyEmail, String reason) throws Exception {
        User faculty = userRepository.findByEmail(facultyEmail).orElse(null);
        if (faculty == null || faculty.getRole() != User.UserRole.FACULTY) {
            throw new Exception("Only faculty can reject activities");
        }
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new Exception("Activity not found"));
        activity.setStatus(Status.REJECTED);
        activity.setApprovedBy(faculty.getId());
        activity.setApprovedAt(LocalDateTime.now());
        activity.setRejectionReason(reason);
        return activityRepository.save(activity);
    }

    // Certifications helpers
    public Activity submitCertification(Activity activity, MultipartFile certificate, String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) throw new Exception("User not found");
        if (user.getRole() != User.UserRole.STUDENT) throw new Exception("Only students can add certifications");

        activity.setStudentId(user.getId());
        activity.setStatus(Status.APPROVED);
        if (certificate != null && !certificate.isEmpty()) {
            String stored = fileStorageService.storeResourceFile(certificate);
            activity.setCertificateFile(stored);
        }
        return activityRepository.save(activity);
    }

    public List<Activity> getMyCertifications(String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) throw new Exception("User not found");
        return activityRepository.findByStudentIdAndCategoryInOrderByCreatedAtDesc(
                user.getId(),
                java.util.List.of("CERT_COURSE", "CERT_INTERNSHIP")
        );
    }

    public void deleteMyCertification(Long id, String userEmail) throws Exception {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) throw new Exception("User not found");
        Activity a = activityRepository.findById(id).orElseThrow(() -> new Exception("Not found"));
        if (!a.getStudentId().equals(user.getId())) throw new Exception("Not authorized");
        if (a.getCertificateFile() != null) {
            fileStorageService.deleteResourceFile(a.getCertificateFile());
        }
        activityRepository.delete(a);
    }
}


