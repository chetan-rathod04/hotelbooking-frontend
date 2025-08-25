import React from "react";

const colorMap = {
  hotels: "blue",
  rooms: "green",
  bookings: "orange",
  users: "purple",
};

const activeBgMap = {
  hotels: "bg-blue-600",
  rooms: "bg-green-600",
  bookings: "bg-orange-600",
  users: "bg-purple-600",
};

const hoverBgMap = {
  hotels: "hover:bg-blue-100",
  rooms: "hover:bg-green-100",
  bookings: "hover:bg-orange-100",
  users: "hover:bg-purple-100",
};

export default function Sidebar({ activeTable, setActiveTable }) {
  const buttons = [
    { label: "Hotels", value: "hotels" },
    { label: "Rooms", value: "rooms" },
    { label: "Bookings", value: "bookings" },
    { label: "Users", value: "users" },
  ];

  return (
    <div className="w-48 bg-white shadow-lg rounded-xl p-4 mr-8 h-fit sticky top-8 self-start">
      <div className="flex flex-col gap-4">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            className={`py-2 px-4 rounded text-left ${
              activeTable === btn.value
                ? `${activeBgMap[btn.value]} text-white`
                : `bg-gray-100 text-gray-800 ${hoverBgMap[btn.value]}`
            }`}
            onClick={() => setActiveTable(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
