package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Task> getTasks(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        return taskRepository.findByUser(user);
    }

    @PostMapping
    public Task addTask(@RequestBody Task task, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        task.setUser(user);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        Task task = taskRepository.findById(id).orElseThrow();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this task");
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCategory(taskDetails.getCategory());
        task.setStatus(taskDetails.getStatus());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id, Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        Task task = taskRepository.findById(id).orElseThrow();
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this task");
        }

        taskRepository.delete(task);
        return "Task deleted successfully!";
    }
}
