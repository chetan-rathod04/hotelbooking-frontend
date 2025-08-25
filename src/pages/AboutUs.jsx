import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-yellow-50 py-30  px-6  ">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center ">
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6 border-b-4 border-orange-400 inline-block pb-2">
            About Us
          </h1>

          <p className="text-lg leading-relaxed font-serif text-gray-700 mb-6">
            <span className="font-semibold text-gray-900">HotelBooking</span> is
            your trusted platform for effortless hotel booking. From cozy budget
            stays to luxury resorts, we make your travel experience smooth,
            reliable, and enjoyable across India.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 mb-8 font-serif">
            Our mission is to provide a seamless and delightful booking
            experience for every traveler. With carefully selected hotel
            partners and a user-friendly interface, we make your comfort our top
            priority.
          </p>

          <Link
            to="/about-us"
            className="text-orange-500 font-semibold hover:text-orange-600 transition-all duration-200 relative group"
          >
            Learn More →
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </motion.div>

        {/* Right Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center md:justify-end"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative rounded-2xl overflow-hidden shadow-2xl w-full md:w-[85%]"
          >
            <img
              src="https://themewagon.github.io/keto/images/about.png"
              alt="About HotelBooking"
              className="w-full h-auto object-cover"
            />
            {/* Gradient Overlay for Premium Feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
