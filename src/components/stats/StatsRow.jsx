import React from "react";
import { motion } from "framer-motion";
import { FaHotel, FaCity, FaSmile, FaUserFriends } from "react-icons/fa";

export default function StatsRow() {
  const stats = [
    {
      icon: <FaHotel className="text-orange-500 text-5xl mb-3" />,
      value: "500+",
      label: "Hotels",
    },
    {
      icon: <FaCity className="text-blue-500 text-5xl mb-3" />,
      value: "50+",
      label: "Cities",
    },
    {
      icon: <FaUserFriends className="text-green-500 text-5xl mb-3" />,
      value: "10K+",
      label: "Happy Customers",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-6 mt-0 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center"
          >
            {stat.icon}
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              {stat.value}
            </motion.h2>
            <p className="text-lg font-medium text-gray-700">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
