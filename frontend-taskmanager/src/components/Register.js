import React, { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
      });
      alert("Registration successful. Please log in.");
      onRegisterSuccess();
    } catch (err) {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 underline dark:text-indigo-400"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
