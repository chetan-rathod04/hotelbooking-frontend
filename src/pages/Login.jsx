import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear previous error

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      let { username: user, role } = res.data;
      if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");
      role = role.toUpperCase();

      login({ username: user, role });

      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "USER") {
        navigate("/user-dashboard");
      } else {
        setErrorMsg("Unknown role. Please contact support.");
      }
    } catch (error) {
      console.error("Login failed", error);
      if (error.response && error.response.data) {
        // Backend error (e.g., 401, 400, etc.)
        const data = error.response.data;
        setErrorMsg(data.error || "Invalid username or password");
      } else {
        // Network or unknown error
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Login
        </h2>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>

        {/* Register Button */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
