import React, { useState, useEffect } from "react";
import axios from "axios";

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

   // Load tasks initially
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks when component loads
  const fetchTasks = () => {
    axios.get("http://localhost:8080/api/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  };

  const addTask = (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      category,
      status: "PENDING"
    };

    axios.post("http://localhost:8080/api/tasks", newTask)
      .then(response => {
        setTasks([...tasks, response.data]); // update UI instantly
        setTitle("");
        setDescription("");
        setCategory("");
      })
      .catch(error => console.error("Error adding task:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Task Manager</h2>

      {/* Add Task Form */}
      <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">➕ Add</button>
      </form>

      <ul>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id}>
              {task.title} - {task.status} - {task.category}
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
}

export default TaskApp;