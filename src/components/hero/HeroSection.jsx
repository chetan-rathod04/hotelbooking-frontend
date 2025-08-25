import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000",
  ];

  // ✅ Auto Slide Change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Debounced Hotel Search
  const fetchHotels = useCallback(async () => {
    if (searchTerm.trim().length < 2) {
      setFilteredHotels([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/hotels/search?query=${encodeURIComponent(
          searchTerm
        )}`
      );
      setFilteredHotels(res.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delay = setTimeout(fetchHotels, 300); // debounce
    return () => clearTimeout(delay);
  }, [fetchHotels]);

  // ✅ Handle Search
  const handleSearch = (selectedHotel = null) => {
    const searchValue = selectedHotel || searchTerm;
    if (!searchValue.trim()) return;

    const match = filteredHotels.find(
      (hotel) => hotel.name.toLowerCase() === searchValue.toLowerCase().trim()
    );

    navigate(
      match
        ? `/hotel/${match._id || match.id}`
        : `/hotels?search=${encodeURIComponent(searchValue)}`
    );

    setFilteredHotels([]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden text-white text-center px-4 sm:px-6">
      {/* Background Images */}
      {backgroundImages.map((img, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentSlide ? 1 : 0,
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.05,
          }}
          transition={{ duration: 1.2 }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content */}
      <motion.div
        className="relative z-20 max-w-3xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
          Welcome to <span className="text-orange-300">HotelBooking</span>
        </h1>
        <p className="text-lg sm:text-xl mb-6 opacity-90">
          Book luxury hotels, explore rooms, and stay updated with our travel
          blogs.
        </p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative w-full sm:w-2/3 lg:w-1/2 mx-auto mb-6"
          ref={inputRef}
        >
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search hotels by name..."
              className="px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-orange-400 
                         transition text-black placeholder-white/70 
                         bg-white/10 backdrop-blur-md shadow-md focus:bg-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg 
                         text-lg font-semibold shadow-md backdrop-blur-md
                         transition-all duration-200 hover:scale-105"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <ul
              className="absolute bg-white/70 backdrop-blur-md border mt-1 w-full 
                           rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
            >
              {loading ? (
                <li className="px-4 py-2 text-gray-500">Loading...</li>
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <li
                    key={hotel._id || hotel.id}
                    onClick={() => handleSearch(hotel.name)}
                    className="px-3 py-2 hover:bg-orange-200/60 cursor-pointer text-orange-900 transition"
                  >
                    {hotel.name} -{" "}
                    <span className="text-gray-700">{hotel.location}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No hotels found</li>
              )}
            </ul>
          )}
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href="#hotels"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 
                     px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
        >
          Explore Now
        </motion.a>
      </motion.div>
    </section>
  );
}
