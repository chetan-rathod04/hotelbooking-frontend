import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import BookingsTable from "./BookingTable";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/user/profile", { withCredentials: true });
        setUser(res.data);
        const userId = res.data.id || res.data._id;
        const bookingsRes = await axios.get(`/bookings/${userId}`, {
          withCredentials: true,
        });
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("❌ Fetch failed", err);
        setError("Could not load profile or bookings.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = bookings.filter((b) => {
      const from = new Date(b.fromDate);
      const to = new Date(b.toDate);
      if (filter === "upcoming") return from > now;
      if (filter === "completed") return to < now;
      if (filter === "cancelled") return b.status === "CANCELLED";
      return true;
    });
    setFilteredBookings(filtered);
  }, [filter, bookings]);

  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `/bookings/cancelstatus/${id}`,
        {},
        { withCredentials: true }
      );
      const userId = user.id || user._id;
      const res = await axios.get(`/bookings/${userId}`, {
        withCredentials: true,
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error("❌ Cancel error", err);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const res = await axios.get(`/bookings/invoice/${id}`, {
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Download error", err);
    }
  };

  const openEditDialog = () => {
    setEditForm({
      username: user.username,
      email: user.email,
      avatar: null,
    });
    setShowUpdateDialog(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setEditForm((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!user?.id && !user?._id) {
      setError("User ID is missing. Cannot update profile.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("email", editForm.email);
      if (editForm.avatar) formData.append("avatar", editForm.avatar);

      const userId = user.id || user._id;

      const res = await axios.put(`/user/update/${userId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      setShowUpdateDialog(false);
    } catch (err) {
      console.error("❌ Update failed", err);
      setError("Profile update failed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* User Info */}
      {user && (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              user.avatar
                ? `http://localhost:8080/uploads/${user.avatar}`
                : "https://i.pravatar.cc/80"
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-orange-700">
              {user.username}
            </h2>
            <p className="text-amber-100">{user.email}</p>
            <button
              onClick={openEditDialog}
              className="mt-2 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-4">
        {["all", "upcoming", "completed", "cancelled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded transition ${
              filter === type
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <BookingsTable
        bookings={filteredBookings}
        cancelBooking={cancelBooking}
        downloadInvoice={downloadInvoice}
      />

      {/* 🔶 Profile Update Modal */}
      {showUpdateDialog && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleProfileUpdate}
            className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-6 text-orange-700 text-center ">
              Update Profile
            </h3>

            <label className="block mb-3">
              <span className="text-gray-700 font-bold">Username</span>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleEditChange}
                className="mt-1 w-full border px-3 py-2 rounded text-gray-800"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-bold">Email</span>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="mt-1 w-full border px-3 py-2 rounded text-gray-800"
              />
            </label>

            <label className="block mb-4">
              <span className="text-gray-700 font-bold">Image</span>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleEditChange}
                className="mt-1 w-full text-gray-800"
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowUpdateDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
