import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "../components/common/Footer";
import HeroSection from "../components/hero/HeroSection";
import Blog from "./Blog";
import AboutUs from "./AboutUs";
import StatsRow from "../components/stats/StatsRow";
import ContactUs from "./ContactUs";

export default function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Blogs
  const blogs = [
    {
      key: "taj-exotica-goa",
      name: "Taj Exotica, Goa",
      img: "https://cdn.sanity.io/images/ocl5w36p/prod5/7f670bfa5526d98384d50b071fa18f5bbe184802-5208x3640.jpg?w=480&auto=format&dpr=2",
      desc: "A luxury beach resort set amidst lush greenery and the Arabian Sea.",
    },
    {
      key: "leela-kovalam",
      name: "The Leela, Kovalam",
      img: "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/Hero%202_1920x950_1.jpg",
      desc: "Perched on a cliff, offering panoramic views of the Kovalam shoreline.",
    },
    {
      key: "marari-kerala",
      name: "Marari Beach Resort, Kerala",
      img: "https://www.cghearth.com/uploads/DestinationImages/20250714075129amdestimgcgh-marari-beach-pool-villa.png",
      desc: "An eco-friendly retreat with coconut groves and pristine beaches.",
    },
    {
      key: "radhanagar-andaman",
      name: "Radhanagar Beach Resort, Andaman",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      desc: "A tranquil escape on the famous Radhanagar Beach, Havelock Island.",
    },
    {
      key: "vivanta-bekal",
      name: "Vivanta by Taj, Bekal",
      img: "https://cdn.sanity.io/images/ocl5w36p/prod5/803e8337090bc5da85aabe8c3f7a9f3943331d81-1000x667.jpg",
      desc: "A riverside resort with Kettuvallam houseboat-inspired villas.",
    },
  ];

  // Fetch Hotels and Rooms
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/hotels/all");
        setHotels(res.data);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoadingHotels(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/rooms/all");
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchHotels();
    fetchRooms();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  // Filter hotels by search term
  const filteredHotels = hotels.filter((hotel) =>
    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white shadow rounded-lg overflow-hidden h-60" />
  );

  return (
    <div className="bg-gray-50">
      <HeroSection />
      <AboutUs />
      <StatsRow />
      {/* Hotels Slider */}
      <section id="hotels" className="py-16 px-6 bg-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🏨 Popular Hotels
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/hotels"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 
               hover:from-blue-600 hover:to-indigo-700 text-white 
               px-5 py-2 rounded-xl text-sm md:text-base font-semibold
               shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              View All Hotels
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {loadingHotels ? (
          <div className="flex gap-4 justify-center">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : filteredHotels.length === 0 ? (
          <p className="text-center text-gray-500">No hotels available</p>
        ) : (
          <Slider {...sliderSettings}>
            {filteredHotels.map((hotel) => (
              <div key={hotel.id || hotel._id} className="p-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <img
                    src={`http://localhost:8080/uploads/${
                      hotel.image || "default-hotel.jpg"
                    }`}
                    alt={hotel.name}
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400x200")
                    }
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600">{hotel.location}</p>
                    <p className="text-orange-600 font-bold mt-1">
                      ₹{hotel.pricePerNight?.toLocaleString("en-IN")} / night
                    </p>
                    <Link
                      to={`/hotel/${hotel._id || hotel.id}`}
                      className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Rooms Slider */}
      <section id="rooms" className="py-16 px-6 bg-gray-100">
        <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-800">🛏 Featured Rooms</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/rooms"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 
               hover:from-green-600 hover:to-emerald-700 text-white 
               px-5 py-2 rounded-xl text-sm md:text-base font-semibold
               shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              View All Rooms
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {loadingRooms ? (
          <div className="flex gap-4 justify-center">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">No rooms available</p>
        ) : (
          <Slider {...sliderSettings}>
            {rooms.map((room) => (
              <div key={room.id || room._id} className="p-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <img
                    src={`http://localhost:8080/uploads/${
                      room.image || "default-room.jpg"
                    }`}
                    alt={room.roomNumber}
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400x200")
                    }
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Room #{room.roomNumber}
                    </h3>
                    <p className="text-gray-600">{room.type}</p>
                    <p className="text-green-600 font-bold mt-1">
                      ₹{room.pricePerNight?.toLocaleString("en-IN")}
                    </p>
                    <Link
                      to={`/room/${room._id}`}
                      className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Blogs Section */}
      <section className="bg-black/60 ">
        <Blog />
      </section>
      <ContactUs />
    </div>
  );
}
