import React, { useState } from "react";
import api from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";

export default function HotelsTable({ hotels, fetchAllData }) {
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({
    hotelNumber: "",
    name: "",
    location: "",
    pricePerNight: "",
    available: true,
  });

  const [showEditHotel, setShowEditHotel] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (message, type = "info") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    isEdit
      ? setEditingHotel({ ...editingHotel, [name]: updatedValue })
      : setNewHotel({ ...newHotel, [name]: updatedValue });
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await api.post("/hotels/add", newHotel);
      setShowAddHotel(false);
      setNewHotel({
        hotelNumber: "",
        name: "",
        location: "",
        pricePerNight: "",
        available: true,
      });
      fetchAllData?.();
      showToast("Hotel added successfully!", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Error adding hotel. Please try again.";
      showToast(errorMsg, "error");
    }
  };

  const handleEditHotel = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/hotels/update/${editingHotel.id}`, editingHotel);
      setShowEditHotel(false);
      setEditingHotel(null);
      fetchAllData?.();
      showToast("Hotel updated successfully!", "success");
    } catch (err) {
      showToast("Error updating hotel", "error");
    }
  };

  const deleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await api.delete(`/hotels/delete/${id}`);
        fetchAllData?.();
        showToast("Hotel deleted", "success");
      } catch (err) {
        showToast("Error deleting hotel", "error");
      }
    }
  };

  const openEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setShowEditHotel(true);
  };

  const filteredHotels = hotels.filter((hotel) =>
    [hotel.name, hotel.location, hotel.hotelNumber].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <section>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Hotels</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name, location, or number"
            className="px-4 py-2 border rounded-md shadow-sm text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowAddHotel(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Hotel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-6 py-3 text-left">Hotel Number</th>
              <th className="px-6 py-3 text-left">Hotel Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Price/Night</th>
              <th className="px-6 py-3 text-left">Available</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hotels found.
                </td>
              </tr>
            ) : (
              filteredHotels.map((hotel) => (
                <tr
                  key={hotel.id}
                  className="border-b hover:bg-blue-50 text-black"
                >
                  <td className="px-6 py-4">{hotel.hotelNumber}</td>
                  <td className="px-6 py-4">{hotel.name}</td>
                  <td className="px-6 py-4">{hotel.location}</td>
                  <td className="px-6 py-4">{hotel.pricePerNight}</td>
                  <td className="px-6 py-4">
                    {hotel.available ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-center">
                    <button
                      onClick={() => openEditHotel(hotel)}
                      className="px-3 py-1 bg-yellow-400 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHotel(hotel.id)}
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

      {/* Add Hotel Modal */}
      {showAddHotel && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowAddHotel(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Add Hotel</h3>
            <form onSubmit={handleAddHotel} className="space-y-4">
              {Object.keys(newHotel).map((key) =>
                key !== "available" ? (
                  <input
                    key={key}
                    type={key === "pricePerNight" ? "number" : "text"}
                    name={key}
                    placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                    className="input input-bordered w-full"
                    value={newHotel[key]}
                    onChange={handleInputChange}
                    required
                  />
                ) : null
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="available"
                  checked={newHotel.available}
                  onChange={handleInputChange}
                />
                Available
              </label>
              <button type="submit" className="btn btn-primary w-full">
                Add Hotel
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Edit Hotel Modal */}
      {showEditHotel && editingHotel && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
              onClick={() => {
                setShowEditHotel(false);
                setEditingHotel(null);
              }}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4 text-center ">Edit Hotel</h3>
            <form onSubmit={handleEditHotel} className="space-y-4">
              {Object.keys(editingHotel).map((key) => {
                const excludeKeys = [
                  "available",
                  "hotelId",
                  // "roomId",
                  "rating",
                  "id",
                  "_id",
                ];
                if (excludeKeys.includes(key)) return null;

                return (
                  <input
                    key={key}
                    type={key === "pricePerNight" ? "number" : "text"}
                    name={key}
                    placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                    className="input input-bordered w-full"
                    value={editingHotel[key]}
                    onChange={(e) => handleInputChange(e, true)}
                    disabled={key === "roomId"} // disables input if it's roomId
                    required
                  />
                );
              })}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="available"
                  checked={editingHotel.available}
                  onChange={(e) => handleInputChange(e, true)}
                />
                Available
              </label>
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
