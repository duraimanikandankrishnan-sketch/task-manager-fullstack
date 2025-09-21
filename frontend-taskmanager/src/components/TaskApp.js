import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function TaskApp() {
  const { token } = useContext(AuthContext); // ✅ get token from context

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !localStorage.getItem("theme"))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [page, setPage] = useState(0);
  const [size] = useState(5); // fixed page size
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const API_URL = "http://localhost:8080/api/tasks";

  // ✅ Sync dark mode with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, filterCategory]);

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` },
      params: {
          page,
          size,
          status: filterStatus || undefined,
          category: filterCategory || undefined,
        }, })
      .then((response) => { setTasks(response.data.content); 
        setTotalPages(response.data.totalPages);
      })
      .catch(() => setError("⚠️ Failed to load tasks. Please try again."))
    .finally(() => setLoading(false));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = { title, description, category, status: "PENDING" };

    axios
      .post(API_URL, newTask, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setTitle("");
        setDescription("");
        setCategory("");
        fetchTasks(); // ✅ refresh list from backend
      })
      .catch((error) => console.error("❌ Error adding task:", error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        fetchTasks();
      })
      .catch((error) => console.error("❌ Error deleting task:", error));
  };

  const toggleStatus = (task) => {
    const updated = {
      ...task,
      status: task.status === "PENDING" ? "DONE" : "PENDING",
    };

    axios
      .put(`${API_URL}/${task.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
        fetchTasks();
      })
      .catch((error) => console.error("❌ Error updating task:", error));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header with Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          📋 Task Manager
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold hover:opacity-80 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Filters */}
<div className="flex gap-4 mb-6">
  <select
    value={filterStatus}
    onChange={(e) => {
      setPage(0);
      setFilterStatus(e.target.value);
    }}
    className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
  >
    <option value="">All Status</option>
    <option value="PENDING">Pending</option>
    <option value="DONE">Done</option>
  </select>

  <select
  value={filterCategory}
  onChange={(e) => {
    setPage(0);
    setFilterCategory(e.target.value);
  }}
  className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
>
  <option value="">All Categories</option>
  <option value="Work">Work</option>
  <option value="Personal">Personal</option>
  <option value="Shopping">Shopping</option>
</select>
</div>


      {/* Add Task Form */}
      <form
        onSubmit={addTask}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="col-span-1 md:col-span-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-1 md:col-span-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-1 md:col-span-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          ➕ Add
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">⏳ Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition hover:shadow-lg hover:scale-[1.01]"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {task.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {task.description}
                </p>
                <p className="text-sm mt-1">
                  <span
                    className={`font-medium ${
                      task.status === "PENDING"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.category && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {" "}
                      • {task.category}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleStatus(task)}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                    task.status === "PENDING"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {task.status === "PENDING" ? "Done" : "Pending"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  ❌ Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center italic mt-6">
            🎉 No tasks yet — add one above!
          </p>
        )}
      </ul>

      {/* Pagination */}
<div className="flex justify-center items-center gap-4 mt-6">
  <button
    disabled={page === 0}
    onClick={() => setPage((p) => p - 1)}
    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:opacity-80"
  >
    ⬅ Prev
  </button>
  <span className="text-gray-700 dark:text-gray-300">
    Page {page + 1} of {totalPages}
  </span>
  <button
    disabled={page + 1 >= totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:opacity-80"
  >
    Next ➡
  </button>
</div>
</div>
  );
}

export default TaskApp;
