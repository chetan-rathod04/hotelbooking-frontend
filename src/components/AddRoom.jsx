import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function AddRoom({ onClose, fetchAllData }) {
  const [roomData, setRoomData] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: "", // ✅ Match backend field
    hotelId: "",
    available: true,
  });

  const [hotels, setHotels] = useState([]);

  // ✅ Fetch hotel options for dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotels/all");
        setHotels(res.data);
      } catch (error) {
        console.error("Failed to load hotels", error);
      }
    };
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms/add", roomData);
      if (fetchAllData) fetchAllData();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding room", err);
      alert("Room creation failed. Please check the data.");
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Add Room</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          className="input input-bordered w-full"
          value={roomData.roomNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Room Type"
          className="input input-bordered w-full"
          value={roomData.type}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price Per Night"
          className="input input-bordered w-full"
          value={roomData.pricePerNight}
          onChange={handleChange}
          required
        />
        <select
          name="hotelId"
          className="select select-bordered w-full"
          value={roomData.hotelId}
          onChange={handleChange}
          required
        >
          <option value="">Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id || hotel._id} value={hotel.id || hotel._id}>
              {hotel.name} - {hotel.location}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2 text-green-700">
          <input
            type="checkbox"
            name="available"
            checked={roomData.available}
            onChange={handleChange}
          />
          <span>Available</span>
        </label>

        <button type="submit" className="btn btn-success w-full">
          Add Room
        </button>
      </form>
    </div>
  );
}
