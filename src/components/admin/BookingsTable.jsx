import React, { useState } from "react";

export default function BookingsTable({ bookings, deleteBooking }) {
  const [searchTerm, setSearchTerm] = useState("");

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteBooking(id);
  //     alert("Booking deleted successfully.");
  //   } catch (error) {
  //     const errorMsg =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "Failed to delete booking.";
  //     alert(errorMsg);
  //   }
  // };
  const handleDelete = (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmed) {
      // Call API to delete booking
      api
        .delete(`/bookings/${bookingId}`)
        .then((res) => {
          alert("Booking cancelled successfully.");
          // Optional: refresh booking list
          fetchBookings();
        })
        .catch((err) => {
          alert("Failed to cancel booking.");
          console.error(err);
        });
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingNumber = booking.bookingNumber || "";
    const username = booking.user?.username || booking.username || "";
    const hotelName = booking.hotel?.name || booking.hotelName || "";

    const search = searchTerm.toLowerCase();
    return (
      bookingNumber.toLowerCase().includes(search) ||
      username.toLowerCase().includes(search) ||
      hotelName.toLowerCase().includes(search)
    );
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-orange-700">Bookings</h2>
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm text-amber-800 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-72"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-orange-100 text-orange-800">
            <tr>
              <th className="px-6 py-3 text-left">Booking Number</th>
              <th className="px-6 py-3 text-left">User Name</th>
              <th className="px-6 py-3 text-left">Hotel Name</th>
              <th className="px-6 py-3 text-left">Room No.</th>
              <th className="px-6 py-3 text-left">Check In</th>
              <th className="px-6 py-3 text-left">Check Out</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-orange-50 text-black"
                >
                  <td className="px-6 py-4">
                    {booking.bookingNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {booking.user?.username || booking.username || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {booking.hotel?.name || booking.hotelName || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {booking.room?.roomNumber ||
                      booking.roomnumber ||
                      booking.roomNo ||
                      "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {booking.checkInDate || booking.fromDate || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {booking.checkOutDate || booking.toDate || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "text-green-700 bg-green-200"
                          : booking.status === "CANCELLED"
                          ? "text-red-700 bg-red-200"
                          : booking.status === "RUNNING"
                          ? "text-blue-700 bg-blue-200"
                          : booking.status === "COMPLETED"
                          ? "text-gray-700 bg-gray-200"
                          : "text-orange-600 bg-orange-200"
                      }`}
                    >
                      {booking.status || "PENDING"}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href={`http://localhost:8080/api/bookings/invoice/${booking.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-blue-500 rounded text-white hover:bg-blue-600"
                      >
                        Invoice
                      </a>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="px-3 py-1 bg-red-500 rounded text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
