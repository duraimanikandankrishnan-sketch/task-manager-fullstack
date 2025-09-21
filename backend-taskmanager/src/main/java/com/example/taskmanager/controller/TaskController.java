package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);


    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = (principal instanceof UserDetails) ? 
                          ((UserDetails) principal).getUsername() : principal.toString();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public Page<Task> getTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (status != null && !status.isEmpty()) {
            return taskRepository.findByUserIdAndStatus(user.getId(), status, pageable);
        }

        if (category != null && !category.isEmpty()) {
            return taskRepository.findByUserIdAndCategory(user.getId(), category, pageable);
        }

        return taskRepository.findByUserId(user.getId(), pageable);
    }

    @PostMapping
    public Task addTask(@Valid @RequestBody Task task, Authentication authentication) {
        logger.info("Creating task: {}", task.getTitle());
        task.setUser(getCurrentUser());
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id,  @Valid @RequestBody Task taskDetails, Authentication authentication) {
        logger.info("Updating task with id: {}", id);
     Task task = taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
        
        String currentUser = authentication.getName();    
        if (!task.getUser().getUsername().equals(currentUser)) {
        logger.warn("User {} tried to update task {}", currentUser, id);
        throw new AccessDeniedException("Not authorized to update this task");

    }

    logger.info("User {} updating task {}", currentUser, id);


        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCategory(taskDetails.getCategory());
        task.setStatus(taskDetails.getStatus());

         Task updated = taskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication authentication) {

        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));        
            
           String currentUser = authentication.getName();
    if (!task.getUser().getUsername().equals(currentUser)) {
        logger.warn("User {} tried to delete task {}", currentUser, id);
        throw new AccessDeniedException("Not authorized to delete this task");

    }

    logger.info("User {} deleting task {}", currentUser, id);

       taskRepository.delete(task);
    return ResponseEntity.noContent().build(); // ✅ 204 No Content
    }
}
