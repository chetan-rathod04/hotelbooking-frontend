// UserProfileCard.jsx
import React from "react";

export default function UserProfileCard({ user, onAvatarUpload, onEdit }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={
            user?.avatar
              ? `http://localhost:8080/uploads/${user.avatar}`
              : "/default-avatar.png"
          }
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-lg">{user?.username}</p>
          <p className="text-gray-500">{user?.email}</p>
          <input
            type="file"
            onChange={onAvatarUpload}
            className="mt-2 text-sm"
          />
        </div>
      </div>
      <button
        onClick={onEdit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}
