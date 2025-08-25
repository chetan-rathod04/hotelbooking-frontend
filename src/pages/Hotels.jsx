import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import HotelCard from "../components/hotels/HotelCard";
import AddReviewModal from "../components/hotels/AddReviewModal";
import { useLocation } from "react-router-dom"; // ✅ import

export default function Hotels() {
  const { authUser } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const location = useLocation(); // ✅ detect route changes

  // ✅ Scroll to top when Hotels page mounts or route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  // ✅ Fetch all hotels
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/hotels/all", {
        withCredentials: true,
      });
      const hotelList = Array.isArray(res.data) ? res.data : [];
      setHotels(hotelList);
      setFilteredHotels([]);
      setError(hotelList.length === 0 ? "No hotels found." : "");
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      setError("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search hotels by name/location
  const searchHotels = async (term = searchTerm) => {
    if (!term.trim()) {
      setFilteredHotels([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/hotels/search?query=${encodeURIComponent(
          term
        )}`,
        { withCredentials: true }
      );
      const hotelList = Array.isArray(res.data) ? res.data : [];
      setFilteredHotels(hotelList);
      setError(
        hotelList.length === 0 ? "No hotels found for your search." : ""
      );
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Suggestions (from all hotels)
  const suggestions = searchTerm
    ? hotels
        .filter(
          (h) =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const selectSuggestion = (value) => {
    setSearchTerm(value);
    setFilteredHotels([]); // Clear existing
    searchHotels(value);
  };

  // ✅ Clear search results
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredHotels([]);
    setError("");
  };

  useEffect(() => {
    if (authUser) fetchHotels();
  }, [authUser]);

  const openReviewModal = (hotel) => {
    setSelectedHotel(hotel);
    setShowReviewModal(true);
  };
  const closeReviewModal = () => {
    setSelectedHotel(null);
    setShowReviewModal(false);
  };

  // ✅ Split hotels
  const searchedIds = new Set(filteredHotels.map((h) => h._id || h.id));
  const remainingHotels = hotels.filter((h) => !searchedIds.has(h._id || h.id));

  return (
    <div className="p-6 py-16 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">
        Available Hotels
      </h2>

      {/* ✅ Search Bar */}
      <div className="relative w-full sm:w-2/3 lg:w-1/2 mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchHotels()}
          className="border p-2 rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border mt-1 w-full rounded shadow-md z-10">
            {suggestions.map((s) => (
              <li
                key={s._id || s.id}
                onClick={() => selectSuggestion(s.name)}
                className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-orange-800"
              >
                {s.name} - <span className="text-gray-900">{s.location}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Search Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => searchHotels()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {loading ? (
        <p className="text-gray-600 text-center">Loading hotels...</p>
      ) : (
        <>
          {/* ✅ Search Results (Permanent Section) */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-700">
                🔍 Search Results
              </h3>
              {filteredHotels.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Clear All
                </button>
              )}
            </div>

            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel._id || hotel.id}
                    hotel={hotel}
                    openReviewModal={openReviewModal}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center italic">
                No search results. Try searching above.
              </p>
            )}
          </div>

          {/* ✅ Remaining Hotels */}
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            {filteredHotels.length > 0 ? "Other Hotels" : "All Hotels"}
          </h3>
          {remainingHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {remainingHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id || hotel.id}
                  hotel={hotel}
                  openReviewModal={openReviewModal}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No more hotels available.
            </p>
          )}
        </>
      )}

      {/* ✅ Review Modal */}
      {showReviewModal && selectedHotel && (
        <AddReviewModal
          hotel={selectedHotel}
          onClose={closeReviewModal}
          onSubmitSuccess={fetchHotels}
        />
      )}
    </div>
  );
}
