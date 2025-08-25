import React, { useState } from "react";
import api from "../api/axios";
import RoomCard from "../components/rooms/RoomCard.jsx";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuth();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch available rooms by date
  const fetchRooms = async () => {
    if (!fromDate || !toDate) {
      return toast.error("Please select both dates!");
    }
    if (new Date(fromDate) >= new Date(toDate)) {
      return toast.error("End date must be after start date!");
    }

    setLoading(true);
    try {
      const response = await api.get("/rooms/available", {
        params: { fromDate, toDate },
        withCredentials: true,
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setRooms(data);

      if (data.length === 0) {
        toast.info("No rooms available for selected dates");
      }
    } catch (error) {
      console.error("❌ Error fetching rooms", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error fetching available rooms");
      }

      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort rooms
  const filteredRooms = rooms
    .filter((r) => (filterType ? r.type === filterType : true))
    .sort((a, b) => {
      if (sortBy === "lowPrice") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "highRating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Available Rooms
      </h1>

      {/* Date Filter */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded text-black"
          />
        </div>
        <button
          onClick={fetchRooms}
          disabled={loading}
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white px-4 py-2 rounded font-semibold`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Type & Sort Filter */}
      <div className="flex gap-4 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="lowPrice">Lowest Price</option>
          <option value="highRating">Highest Rating</option>
        </select>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <p className="text-gray-500">Loading rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <p className="text-gray-500">No rooms available for selected dates.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room._id || room.id}
              room={room}
              userId={authUser?.id}
              fromDate={fromDate}
              toDate={toDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
