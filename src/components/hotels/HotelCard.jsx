import { Link } from "react-router-dom";

export default function HotelCard({ hotel, openReviewModal }) {
  const hotelId = hotel._id || hotel.id;

  const imageUrl = `http://localhost:8080/uploads/${
    hotel.image || "default-room.jpg"
  }`;

  const averageRating = hotel.averageRating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={
        i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
      }
    >
      ★
    </span>
  ));

  const reviewCount = hotel.reviews?.length || 0;

  return (
    <div
      className="border rounded-lg shadow-sm p-3 bg-white flex flex-col h-full text-black 
      transition hover:shadow-md hover:scale-[1.01] duration-200"
    >
      {/* ✅ Image */}
      <img
        src={imageUrl}
        alt={hotel.name}
        className="w-full h-36 object-cover rounded"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "http://localhost:8080/uploads/default-room.jpg";
        }}
      />

      {/* ✅ Info */}
      <div className="mt-2 flex-1">
        <h3 className="text-md font-bold text-amber-700 truncate">
          {hotel.name}
        </h3>
        <p className="text-gray-600 text-sm truncate">{hotel.location}</p>
        <p className="text-orange-600 font-semibold text-sm mt-1">
          ₹{hotel.pricePerNight?.toLocaleString("en-IN")} / night
        </p>

        <div className="mt-1 text-xs flex items-center">
          {stars}
          <span className="ml-2 text-gray-600">
            {averageRating > 0 ? averageRating.toFixed(1) : "No Rating"}
          </span>
          {reviewCount > 0 && (
            <span className="ml-1 text-gray-500">({reviewCount})</span>
          )}
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="mt-2 flex gap-2">
        <Link
          to={`/hotel/${hotel._id || hotel.id}`}
          className="bg-blue-600 text-white flex-1 py-1 text-center rounded text-sm hover:bg-blue-700"
        >
          Details
        </Link>
        {openReviewModal && (
          <button
            onClick={() => openReviewModal(hotel)}
            className="bg-green-600 text-white px-2 rounded text-sm hover:bg-green-700"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
}
