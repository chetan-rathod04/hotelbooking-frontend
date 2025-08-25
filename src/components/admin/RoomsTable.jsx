import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function RoomsTable({ rooms, fetchAllData }) {
  const [hotels, setHotels] = useState([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const showToast = (message, type = "info") => {
    toast[type](message); // type can be 'success', 'error', 'info', 'warning'
  };

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: "",
    hotelId: "",
  });

  const [showEditRoom, setShowEditRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState({
    id: "",
    roomNumber: "",
    type: "",
    pricePerNight: "",
    hotelId: "",
  });

  // Fetch hotels on load
  useEffect(() => {
    api
      .get("/hotels/all")
      .then((res) => setHotels(res.data))
      .catch((err) => console.error("Failed to load hotels", err));
  }, []);

  // Add Room Handlers
  const handleNewRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms/add", newRoom);
      setShowAddRoom(false);
      setNewRoom({ roomNumber: "", type: "", pricePerNight: "", hotelId: "" });
      fetchAllData?.();
      showToast("Room added successfully!", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Error adding room";

      // Check for duplicate roomNumber error
      if (errorMsg.includes("E11000") && errorMsg.includes("roomNumber")) {
        showToast(
          "Room number already exists. Please use a different number.",
          "error"
        );
      } else {
        showToast(errorMsg, "error");
      }
    }
  };

  // Edit Room Handlers
  const openEditRoom = (room) => {
    setEditingRoom({
      id: room._id || room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      hotelId: room.hotelId,
    });
    setShowEditRoom(true);
  };

  const handleEditRoomChange = (e) => {
    const { name, value } = e.target;
    setEditingRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const { id, ...rest } = editingRoom;
      await api.put(`/rooms/roomUpdate/${id}`, rest);
      setShowEditRoom(false);
      setEditingRoom({
        id: "",
        roomNumber: "",
        type: "",
        pricePerNight: "",
        hotelId: "",
      });
      fetchAllData?.();
      showToast("Room updated successfully!", "success");
    } catch (err) {
      const errorMsg = err.response?.data || "Error updating room";
      showToast(errorMsg, "error");
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/delete/${id}`);
      fetchAllData?.();
      showToast("Room deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err.response?.data || "Error deleting room";
      showToast(errorMsg, "error");
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-700">Rooms</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by number or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-72"
          />
          <button
            onClick={() => setShowAddRoom(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add Room
          </button>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="px-6 py-3 text-left">Room Number</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Price/Night</th>
              <th className="px-6 py-3 text-left">Hotel</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No rooms found.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr
                  key={room._id || room.id}
                  className="border-b hover:bg-green-50 text-black"
                >
                  <td className="px-6 py-4">{room.roomNumber}</td>
                  <td className="px-6 py-4">{room.type}</td>
                  <td className="px-6 py-4">{room.pricePerNight}</td>
                  <td className="px-6 py-4">
                    {hotels.find(
                      (h) => h._id === room.hotelId || h.id === room.hotelId
                    )?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-center">
                    <button
                      onClick={() => openEditRoom(room)}
                      className="px-3 py-1 bg-yellow-400 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoom(room._id || room.id)}
                      className="px-3 py-1 bg-red-500 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              onClick={() => setShowAddRoom(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Add Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <input
                name="roomNumber"
                placeholder="Room Number"
                className="input input-bordered w-full"
                value={newRoom.roomNumber}
                onChange={handleNewRoomChange}
                required
              />
              <input
                name="type"
                placeholder="Room Type"
                className="input input-bordered w-full"
                value={newRoom.type}
                onChange={handleNewRoomChange}
                required
              />
              <input
                name="pricePerNight"
                type="number"
                placeholder="Price Per Night"
                className="input input-bordered w-full"
                value={newRoom.pricePerNight}
                onChange={handleNewRoomChange}
                required
              />
              <select
                name="hotelId"
                className="input input-bordered w-full"
                value={newRoom.hotelId}
                onChange={handleNewRoomChange}
                required
              >
                <option value="">Select Hotel</option>
                {hotels.map((h) => (
                  <option key={h._id || h.id} value={h._id || h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary w-full">
                Add Room
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Edit Room Modal */}
      {showEditRoom && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              onClick={() => {
                setShowEditRoom(false);
                setEditingRoom({
                  id: "",
                  roomNumber: "",
                  type: "",
                  pricePerNight: "",
                  hotelId: "",
                });
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Edit Room</h3>
            <form onSubmit={handleEditRoom} className="space-y-4">
              <input
                name="roomNumber"
                placeholder="Room Number"
                className="input input-bordered w-full"
                value={editingRoom.roomNumber}
                onChange={handleEditRoomChange}
                required
              />
              <input
                name="type"
                placeholder="Room Type"
                className="input input-bordered w-full"
                value={editingRoom.type}
                onChange={handleEditRoomChange}
                required
              />
              <input
                name="pricePerNight"
                type="number"
                placeholder="Price Per Night"
                className="input input-bordered w-full"
                value={editingRoom.pricePerNight}
                onChange={handleEditRoomChange}
                required
              />
              <select
                name="hotelId"
                className="input input-bordered w-full"
                value={editingRoom.hotelId}
                onChange={handleEditRoomChange}
                required
              >
                <option value="">Select Hotel</option>
                {hotels.map((h) => (
                  <option key={h._id || h.id} value={h._id || h.id}>
                    {h.name}
                  </option>
                ))}
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
