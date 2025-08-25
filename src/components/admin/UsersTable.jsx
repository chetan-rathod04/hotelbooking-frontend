import React, { useState } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersTable({ users, fetchAllData }) {
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  // Add User dialog state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "USER",
    password: "",
  });
  // Edit User dialog state
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Add User handlers
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/user/admin/add", newUser, {
        withCredentials: true,
      });

      toast.success("✅ User added successfully!");
      setShowAddUser(false);
      setNewUser({
        username: "",
        email: "",
        role: "USER", // ensure proper case
        password: "",
      });
      if (fetchAllData) fetchAllData();
    } catch (err) {
      console.error("🚫 Add user error:", err);
      const res = err?.response?.data;

      if (res?.fieldErrors) {
        // ✅ Handle validation errors (e.g., @NotBlank, etc.)
        Object.entries(res.fieldErrors).forEach(([field, message]) => {
          toast.error(`❌ ${field}: ${message}`);
        });
      } else if (res?.message) {
        // ✅ Show meaningful backend error like "Username already exists"
        toast.error(`❌ ${res.message}`);
      } else if (err.response?.status === 400) {
        // ⛔️ Fallback if no message from backend
        toast.error("❌ Bad Request: Please check the form.");
      } else {
        // ❌ Catch-all
        toast.error("❌ Failed to add user. Please try again.");
      }
    }
  };

  // Edit User handlers
  const openEditUser = (user) => {
    setEditingUser(user);
    setShowEditUser(true);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role.toUpperCase(), // "user" -> "USER"
      };

      await api.put(`/user/admin/update/${editingUser.id}`, updatePayload);

      setShowEditUser(false);
      setEditingUser(null);
      console.log("User updated successfully:", editingUser);
      toast.success("✅ User updated successfully!");
      if (fetchAllData) fetchAllData();
    } catch (err) {
      console.error("Update error:", err);

      // Handle different formats of error responses
      const errorMessage =
        err?.response?.data?.message || // for JSON with `message` field
        err?.response?.data || // for plain string message
        "Unknown error while updating user";

      // alert(`Error: ${errorMessage}`);
      toast.error(`❌ ${errorMessage}`);
      console.error("Error updating user:", errorMessage);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/user/delete/${id}`);
      if (fetchAllData) fetchAllData();
    } catch (err) {
      alert("Error deleting user");
    }
  };
  // ✅ Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <section>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">Users</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by username or email"
            className="px-4 py-2 border rounded-md shadow-sm text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-purple-100 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-purple-50 text-black"
                >
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 space-x-2 text-center">
                    <button
                      onClick={() => openEditUser(user)}
                      className="px-3 py-1 bg-yellow-400 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 bg-red-500 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Dialog */}
      {showAddUser && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowAddUser(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered w-full"
                value={newUser.username}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={newUser.email}
                onChange={handleNewUserChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={newUser.password}
                onChange={handleNewUserChange}
                required
              />
              <select
                name="role"
                className="select select-bordered w-full"
                value={newUser.role}
                onChange={handleNewUserChange}
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button type="submit" className="btn btn-primary w-full">
                Add User
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Edit User Dialog */}
      {showEditUser && editingUser && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setShowEditUser(false);
                setEditingUser(null);
              }}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered w-full"
                value={editingUser.username}
                onChange={handleEditUserChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={editingUser.email}
                onChange={handleEditUserChange}
                required
              />
              <select
                name="role"
                className="select select-bordered w-full"
                value={editingUser.role}
                onChange={handleEditUserChange}
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </form>
          </div>
        </dialog>
      )}
    </section>
  );
}
