package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Fetch tasks for a user (with pagination)
    Page<Task> findByUserId(Long userId, Pageable pageable);

    // Fetch tasks filtered by status (for a user)
    Page<Task> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    // Fetch tasks filtered by category (for a user)
    Page<Task> findByUserIdAndCategory(Long userId, String category, Pageable pageable);
}
