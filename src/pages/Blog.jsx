// src/components/Blog.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const resorts = [
  {
    name: "Taj Exotica, Goa",
    img: "https://cdn.sanity.io/images/ocl5w36p/prod5/7f670bfa5526d98384d50b071fa18f5bbe184802-5208x3640.jpg?w=480&auto=format&dpr=2",
    desc: "A luxury beach resort set amidst lush greenery and the Arabian Sea.",
    details:
      "Taj Exotica in Goa is a luxurious property offering private beaches, lush gardens, and spa facilities. Perfect for couples and families seeking a tranquil escape.",
    map: "https://maps.google.com/?q=Taj+Exotica+Goa",
  },
  {
    name: "The Leela, Kovalam",
    img: "https://www.theleela.com/prod/content/assets/aio-banner/dekstop/Hero%202_1920x950_1.jpg?VersionId=pybH5K7Vix3dL33IX6Z2jzJq3tl5ojCX",
    desc: "Perched on a cliff, offering panoramic views of the Kovalam shoreline.",
    details:
      "The Leela Kovalam is Kerala’s only cliff-top beach resort, offering mesmerizing ocean views, infinity pools, and authentic Ayurvedic spa experiences.",
    map: "https://maps.google.com/?q=The+Leela+Kovalam",
  },
  {
    name: "Marari Beach Resort, Kerala",
    img: "https://www.cghearth.com/uploads/DestinationImages/20250714075129amdestimgcgh-marari-beach-pool-villa.png",
    desc: "An eco-friendly retreat with coconut groves and pristine beaches.",
    details:
      "Marari Beach Resort is an eco-friendly resort inspired by traditional fishing villages. Guests can enjoy yoga sessions, cycling tours, and organic dining experiences.",
    map: "https://maps.google.com/?q=Marari+Beach+Resort",
  },
  {
    name: "Radhanagar Beach Resort, Andaman",
    img: "https://media.gettyimages.com/id/990346612/photo/radhanagar-andaman-jpg.jpg?s=612x612&w=0&k=20&c=82SoMOYikyQHB8uCxgz02kDL15if372nitT3vr8Lh_E=",
    desc: "A tranquil escape on the famous Radhanagar Beach, Havelock Island.",
    details:
      "Located on the award-winning Radhanagar Beach, this resort offers crystal-clear waters, scuba diving, and private villas for a serene island vacation.",
    map: "https://maps.google.com/?q=Radhanagar+Beach+Resort",
  },
  {
    name: "Vivanta by Taj, Bekal",
    img: "https://cdn.sanity.io/images/ocl5w36p/prod5/803e8337090bc5da85aabe8c3f7a9f3943331d81-1000x667.jpg?w=1366&auto=format&dpr=2",
    desc: "A riverside resort with Kettuvallam houseboat-inspired villas.",
    details:
      "Vivanta Bekal combines luxury with Kerala’s backwaters, offering houseboat-style villas, a riverside infinity pool, and a world-class spa experience.",
    map: "https://maps.google.com/?q=Vivanta+Bekal",
  },
];

export default function Blog() {
  const [selectedResort, setSelectedResort] = useState(null);

  const handleShare = (name) => {
    navigator.clipboard.writeText(window.location.href + "#blogs");
    alert(`Link to ${name} copied! 📋`);
  };

  return (
    <section
      id="blogs"
      className="relative py-20 px-6 text-center overflow-hidden "
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0 opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920')",
        }}
      />

      {/* Section Heading */}
      <motion.h2
        className="relative text-3xl sm:text-4xl font-bold mb-8 text-orange-600 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌴 Travel Blog - Top 5 Beach Resorts in India
      </motion.h2>

      {/* Intro Paragraph */}
      <motion.p
        className="relative max-w-3xl mx-auto text-gray-900 font-serif mb-12 text-lg leading-relaxed z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Discover India’s most breathtaking beach resorts where luxury meets
        nature. Perfect for a relaxing vacation or a romantic escape.
      </motion.p>

      {/* Resorts Grid */}
      <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto z-10">
        {resorts.map((resort, idx) => (
          <motion.div
            key={resort.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="relative bg-white/20 backdrop-blur-xl border border-white/30 
                       rounded-xl shadow-lg hover:shadow-orange-400/40 
                       overflow-hidden group"
          >
            <div className="relative overflow-hidden">
              <img
                src={resort.img}
                alt={resort.name}
                className="w-full h-48 object-cover transform group-hover:scale-110 group-hover:rotate-1 transition duration-500"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 text-sm rounded-full shadow">
                #{idx + 1}
              </span>
            </div>
            <div className="p-5 flex flex-col justify-between h-full">
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                {resort.name}
              </h3>
              <p className="text-gray-200 text-sm mb-3">{resort.desc}</p>
              <button
                onClick={() => setSelectedResort(resort)}
                className="mt-auto bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition"
              >
                Read More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedResort && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative overflow-hidden"
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedResort(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <img
                src={selectedResort.img}
                alt={selectedResort.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-orange-700 mb-2">
                {selectedResort.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedResort.details}</p>

              {/* CTA Buttons */}
              <div className="flex justify-between gap-2">
                <a
                  href={selectedResort.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  📍 View on Map
                </a>
                <button
                  onClick={() => alert("Booking Coming Soon!")}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  Book Now
                </button>
                <button
                  onClick={() => handleShare(selectedResort.name)}
                  className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold transition"
                >
                  🔗 Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Wave Divider */}
      <svg
        className="absolute bottom-0 left-0 w-full h-16 text-orange-200"
        viewBox="0 0 1440 320"
        fill="currentColor"
      >
        <path d="M0,192L60,170.7C120,149,240,107,360,122.7C480,139,600,213,720,224C840,235,960,181,1080,170.7C1200,160,1320,192,1380,208L1440,224V320H0Z" />
      </svg>
    </section>
  );
}
