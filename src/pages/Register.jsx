import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState([]); // store multiple error messages
  const navigate = useNavigate();

  // ✅ Password validation function (frontend)
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    setErrors([]); // reset errors

    // ✅ Frontend validation before sending request
    const localErrors = [];
    if (!form.username.trim()) localErrors.push("Username is required.");
    if (!form.email.trim()) localErrors.push("Email is required.");
    if (!form.password.trim()) localErrors.push("Password is required.");
    if (form.password && !validatePassword(form.password)) {
      localErrors.push(
        "Password must be at least 8 characters long, include a letter, a number, and a special character."
      );
    }

    // stop here if frontend validation fails
    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      await api.post("/auth/register", form);
      alert("🎉 Registration successful!");
      navigate("/login");
    } catch (err) {
      let messages = [];

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "string") {
          messages.push(data);
        } else if (data.error) {
          messages.push(data.error);
        } else if (data.message) {
          messages.push(data.message);
        } else if (Array.isArray(data)) {
          messages = data; // backend returned an array of errors
        } else {
          messages.push("❌ Unknown error occurred.");
        }
      } else {
        messages.push("❌ Cannot connect to server.");
      }

      setErrors(messages);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h2>

        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          {/* ✅ Show all error messages */}
          {errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md">
              <ul className="list-disc list-inside text-sm">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
