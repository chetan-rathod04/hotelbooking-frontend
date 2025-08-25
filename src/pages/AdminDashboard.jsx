import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/admin/Sidebar";
import HotelsTable from "../components/admin/HotelsTable";
import RoomsTable from "../components/admin/RoomsTable";
import BookingsTable from "../components/admin/BookingsTable";
import UsersTable from "../components/admin/UsersTable";
import Modals from "../components/admin/AdminModals.jsx";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AdminDashboard() {
  const { authUser } = useAuth();
  const [activeTable, setActiveTable] = useState("hotels");
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [editingData, setEditingData] = useState({});
  const [showModal, setShowModal] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      const [hotelRes, roomRes, userRes, bookingRes] = await Promise.all([
        api.get("/hotels/all"),
        api.get("/rooms/all"),
        api.get("/user/all"),
        api.get("/bookings/allbooking"),
      ]);
      setHotels(hotelRes.data);
      setRooms(roomRes.data);
      setUsers(userRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Bookings handlers for modal
  const openBookingModal = (booking) => {
    setEditingBooking(booking);
    setShowModal({ ...showModal, booking: true });
  };
  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/delete/${id}`);
      fetchAllData();
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex py-25">
      <Sidebar activeTable={activeTable} setActiveTable={setActiveTable} />
      <div className="flex-1 max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-600">
          Manage Hotels, Rooms, Bookings, and Users
        </p>

        {activeTable === "hotels" && (
          <HotelsTable hotels={hotels} fetchAllData={fetchAllData} />
        )}

        {activeTable === "rooms" && (
          <RoomsTable rooms={rooms} fetchAllData={fetchAllData} />
        )}

        {activeTable === "bookings" && (
          <BookingsTable
            bookings={bookings}
            openBookingModal={openBookingModal}
            deleteBooking={deleteBooking}
          />
        )}

        {activeTable === "users" && (
          <UsersTable users={users} fetchAllData={fetchAllData} />
        )}

        <Modals
          showModal={showModal}
          setShowModal={setShowModal}
          editingData={editingData}
          setEditingData={setEditingData}
          fetchAllData={fetchAllData}
          editingBooking={editingBooking}
          setEditingBooking={setEditingBooking}
        />
      </div>
    </div>
  );
}
