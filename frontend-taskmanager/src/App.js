import TaskApp from "./components/TaskApp";
import Login from "./components/Login";
import Register from "./components/Register";
import React, { useState, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  if (!token) {
  return showRegister ? (
    <Register onRegisterSuccess={() => setShowRegister(false)} />
  ) : (
    <Login
      onLoginSuccess={() => setShowRegister(false)}   // ✅ added
      onSwitchToRegister={() => setShowRegister(true)}
    />
  );
}

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-black"
      } min-h-screen`}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 shadow-md">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <TaskApp />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
