import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx"; // for user info

export default function AddReviewModal({ hotel, onClose, onSubmitSuccess }) {
  const { authUser } = useAuth(); // get logged-in user
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!hotel?.id && !hotel?._id) {
      setError("Hotel ID is missing.");
      return;
    }

    if (!authUser) {
      setError("You must be logged in to add a review.");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8080/api/reviews/add`,
        {
          hotelId: hotel.id || hotel._id,
          rating,
          comment,
          userId: authUser.id,
          username: authUser.username,
        },
        { withCredentials: true }
      );

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-amber-700">
          Add Review for {hotel?.name}
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-2 text-gray-800">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4 text-amber-600"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} Star{star > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-gray-800">Comment:</label>
        <textarea
          rows={4}
          className="w-full border p-2 rounded mb-4 text-amber-600"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
