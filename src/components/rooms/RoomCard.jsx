import React, { useState, useEffect } from "react";
import api from "../../api/axios"; // ✅ use same axios instance
import { toast } from "react-toastify";

export default function RoomCard({ room, fromDate, toDate }) {
  const { _id, id, roomNumber, pricePerNight, image, description } = room;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const roomId = _id || id; // ✅ always pick available ID

  const openBookingModal = () => setShowModal(true);
  const closeBookingModal = () => setShowModal(false);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeBookingModal();
    if (showModal) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  // ✅ Format date (yyyy-MM-dd)
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    return d.toISOString().split("T")[0];
  };

  // ✅ Validate dates
  const validateDates = (start, end) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!start || !end) {
      toast.error("Please select both check-in and check-out dates!");
      return false;
    }

    if (startDate < today) {
      toast.error("Check-in date cannot be in the past!");
      return false;
    }

    if (endDate <= startDate) {
      toast.error("Check-out date must be after check-in date!");
      return false;
    }

    return true;
  };

  // ✅ Book room
  const submitBooking = async () => {
    if (!validateDates(fromDate, toDate)) return;

    const payload = {
      roomId,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
    };

    console.log("📤 Booking Data being sent:", payload);

    try {
      setLoading(true);
      const res = await api.post("/bookings/add", payload, {
        withCredentials: true,
      });

      toast.success(res.data?.message || "Room booked successfully!");
      closeBookingModal();
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Booking failed! Please try again.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check room availability for selected dates
  const checkAvailability = async () => {
    try {
      const res = await api.post(`/rooms/check-availability/${roomId}`, {
        fromDate,
        toDate,
      });
      if (res.data.available) {
        toast.success("Room available ✅");
        alert("Room available ✅");
      } else {
        toast.error("Room already booked ❌");
        alert("Room already booked ❌");
      }
    } catch (err) {
      console.error("❌ Availability check error:", err);
      toast.error("Error checking room availability");
      alert("Error checking room availability");
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-200 text-black">
        <img
          src={`http://localhost:8080/uploads/${image || "default-room.jpg"}`}
          alt={`Room ${roomNumber}`}
          className="w-full h-48 object-cover"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")
          }
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Room #{roomNumber}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            ₹{pricePerNight.toLocaleString("en-IN")} per night
          </p>
          <button
            onClick={openBookingModal}
            className="mt-3 w-full py-1.5 rounded text-white font-semibold bg-orange-500 hover:bg-orange-600"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeBookingModal()}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative text-black">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeBookingModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Book Room #{roomNumber}</h2>

            <div className="mb-4">
              <p className="text-gray-700">
                Selected Dates:{" "}
                <strong>
                  {formatDate(fromDate) || "—"} → {formatDate(toDate) || "—"}
                </strong>
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={checkAvailability}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                Check Availability
              </button>
              <button
                onClick={submitBooking}
                className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
