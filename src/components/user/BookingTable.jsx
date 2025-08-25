import React from "react";

export default function BookingsTable({
  bookings,
  cancelBooking,
  downloadInvoice,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl text-indigo-700 mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="px-6 py-3 text-left">Booking No.</th>
                <th className="px-6 py-3 text-left">Hotel Name</th>
                <th className="px-6 py-3 text-left">Room No.</th>
                <th className="px-6 py-3 text-left">From</th>
                <th className="px-6 py-3 text-left">To</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-gray-50 text-gray-700"
                >
                  <td className="px-6 py-4">{b.bookingNumber}</td>
                  <td className="px-6 py-4">{b.hotelName}</td>
                  <td className="px-6 py-4">{b.roomNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(b.fromDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(b.toDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        b.status === "CANCELLED"
                          ? "bg-rose-200 text-rose-800"
                          : b.status === "COMPLETED"
                          ? "bg-green-200 text-green-800"
                          : b.status === "CONFIRMED"
                          ? "bg-emerald-200 text-emerald-800"
                          : b.status === "RUNNING"
                          ? "bg-indigo-200 text-indigo-800"
                          : b.status === "PENDING"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {b.status !== "CANCELLED" && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => downloadInvoice(b.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
