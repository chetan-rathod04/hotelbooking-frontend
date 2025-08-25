import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Scroll to top when page loads or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid hotel ID in URL.");
      setLoading(false);
      return;
    }

    const fetchHotelDetails = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        setHotel(res.data);

        const roomsRes = await api.get(`/rooms/hotel/${id}`);
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        setError("Failed to fetch hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleBookNow = (roomId) => {
    navigate(`/book-room/${roomId}`, {
      state: { hotelId: id, hotelName: hotel?.name },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading hotel details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Hotel not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Header Image ===== */}
      <div className="relative w-full h-72">
        <img
          src={`http://localhost:8080/images/${
            hotel.image || "default-hotel.jpg"
          }`}
          alt={hotel.name}
          className="w-full h-72 object-cover"
          loading="lazy"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/800x400")
          }
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{hotel.name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* ===== Hotel Info ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {hotel.name}
          </h2>
          <p className="text-gray-600 mb-2">📍 {hotel.location}</p>
          <p className="text-orange-600 font-bold text-xl mb-4">
            ₹{hotel.pricePerNight?.toLocaleString("en-IN")} / night
          </p>
          <p className="text-gray-700 leading-relaxed">
            {hotel.description ||
              "This hotel offers luxury rooms and great services."}
          </p>
        </motion.div>

        {/* ===== Rooms Section ===== */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Available Rooms
        </h3>
        {rooms.length === 0 ? (
          <p className="text-gray-600">No rooms available for this hotel.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id || room.id || index}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={`http://localhost:8080/images/${
                    room.image || "default-room.jpg"
                  }`}
                  alt={`Room ${room.roomNumber}`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/400x200")
                  }
                />
                <div className="p-4 text-center">
                  <h4 className="font-semibold text-lg text-gray-800">
                    Room #{room.roomNumber}
                  </h4>
                  <p className="text-gray-600">{room.type}</p>
                  <p className="text-green-600 font-bold mt-1">
                    ₹{room.pricePerNight?.toLocaleString("en-IN")}
                  </p>
                  <button
                    onClick={() => handleBookNow(room._id || room.id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== Back Button ===== */}
        <div className="mt-8 text-center">
          <Link
            to="/hotels"
            className="bg-gray-700 hover:bg-gray-900 text-white px-6 py-2 rounded-lg"
          >
            ← Back to Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
