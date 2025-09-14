import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    console.log("✅ Login response:", res);
    console.log("✅ Token received:", res.data.token);

    // ✅ Explicit check for token
    if (res.data && res.data.token) {
      login(res.data.token);  // save JWT in AuthContext/localStorage
        if (typeof onLoginSuccess === "function") {
         onLoginSuccess();
  }    } else {
      console.error("No token in response:", res.data);
      alert("Login failed: Invalid response from server.");
    }
  } catch (err) {
    console.error("❌ Login error:", err.response || err.message);
    alert("Login failed. Check username/password.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 underline dark:text-indigo-400"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
