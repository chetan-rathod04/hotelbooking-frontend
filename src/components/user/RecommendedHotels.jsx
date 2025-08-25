// RecommendedHotels.jsx
import React from "react";

export default function RecommendedHotels({ hotels, onNavigate }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Recommended Hotels
      </h2>
      {hotels.length === 0 ? (
        <p className="text-gray-500">No hotels available currently.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => onNavigate(hotel.id)}
              className="cursor-pointer p-4 rounded-xl bg-green-50 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <p className="text-sm text-gray-500">{hotel.location}</p>
              <div className="text-yellow-500 mt-2">
                {"★".repeat(Math.round(hotel.rating)) +
                  "☆".repeat(5 - Math.round(hotel.rating))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
