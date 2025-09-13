package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")  // allow frontend later
public class TaskController {

    private final TaskRepository taskRepo;

    public TaskController(TaskRepository taskRepo) {
        this.taskRepo = taskRepo;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        task.setCreatedAt(LocalDateTime.now());
        return taskRepo.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepo.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setStatus(updatedTask.getStatus());
                    task.setCategory(updatedTask.getCategory());
                    return taskRepo.save(task);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
    }
}
