package com.edusync.controller;

import com.edusync.dto.ApiResponse;
import com.edusync.entity.ChatMessage;
import com.edusync.entity.ChatThread;
import com.edusync.repository.ChatMessageRepository;
import com.edusync.repository.ChatThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.edusync.repository.UserRepository;
import com.edusync.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatThreadRepository chatThreadRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/threads")
    public ResponseEntity<ApiResponse> createThread(@RequestParam Long studentId,
                                                    @RequestParam Long facultyId,
                                                    @RequestParam(required = false) String subject) {
        ChatThread t = new ChatThread();
        t.setStudentId(studentId);
        t.setFacultyId(facultyId);
        t.setSubject(subject);
        t.setLastMessageAt(LocalDateTime.now());
        ChatThread saved = chatThreadRepository.save(t);
        return ResponseEntity.ok(new ApiResponse(true, "Thread created", saved));
    }

    @GetMapping("/faculty")
    public ResponseEntity<ApiResponse> listFaculty() {
        var list = userRepository.findByRole(User.UserRole.FACULTY);
        return ResponseEntity.ok(new ApiResponse(true, "Faculty", list));
    }

    @GetMapping("/threads/student/{studentId}")
    public ResponseEntity<ApiResponse> listStudentThreads(@PathVariable Long studentId) {
        List<ChatThread> threads = chatThreadRepository.findByStudentIdOrderByLastMessageAtDesc(studentId);
        return ResponseEntity.ok(new ApiResponse(true, "Threads", threads));
    }

    @GetMapping("/threads/faculty/{facultyId}")
    public ResponseEntity<ApiResponse> listFacultyThreads(@PathVariable Long facultyId) {
        List<ChatThread> threads = chatThreadRepository.findByFacultyIdOrderByLastMessageAtDesc(facultyId);
        return ResponseEntity.ok(new ApiResponse(true, "Threads", threads));
    }

    @GetMapping("/threads/{threadId}/messages")
    public ResponseEntity<ApiResponse> listMessages(@PathVariable Long threadId) {
        List<ChatMessage> messages = chatMessageRepository.findByThreadIdOrderByCreatedAtAsc(threadId);
        return ResponseEntity.ok(new ApiResponse(true, "Messages", messages));
    }

    @PostMapping("/threads/{threadId}/messages")
    public ResponseEntity<ApiResponse> sendMessage(@PathVariable Long threadId,
                                                   @RequestParam Long senderId,
                                                   @RequestParam String senderRole,
                                                   @RequestParam String content) {
        ChatMessage m = new ChatMessage();
        m.setThreadId(threadId);
        m.setSenderId(senderId);
        m.setSenderRole(senderRole);
        m.setContent(content);
        ChatMessage saved = chatMessageRepository.save(m);

        chatThreadRepository.findById(threadId).ifPresent(t -> {
            t.setLastMessageAt(LocalDateTime.now());
            t.setUpdatedAt(LocalDateTime.now());
            chatThreadRepository.save(t);
        });

        Map<String, Object> data = new HashMap<>();
        data.put("message", saved);
        return ResponseEntity.ok(new ApiResponse(true, "Message sent", data));
    }
}


