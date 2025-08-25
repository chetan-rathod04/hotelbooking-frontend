import { motion } from "framer-motion";

export default function AnimatedModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <motion.div
        className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl relative"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-700 hover:text-red-500"
        >
          ×
        </button>
        {children}
      </motion.div>
    </div>
  );
}
