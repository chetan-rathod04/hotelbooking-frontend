// src/components/ContactUs.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("⚠️ All fields are required!");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("⚠️ Please enter a valid email!");
      return;
    }

    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      toast.error("⚠️ Please verify the reCAPTCHA!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contact", { ...formData, captchaToken });
      toast.success("✅ Message sent successfully!");

      // Reset form and captcha
      setFormData({ name: "", email: "", subject: "", message: "" });
      recaptchaRef.current.reset();
    } catch {
      toast.error("❌ Failed to send message. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center"
    >
      <ToastContainer position="bottom-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">
          Get In Touch
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We'd love to hear from you! Please fill out the form below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "subject"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === "email" ? "you@gmail.com" : `Your ${field}`
                }
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            ></textarea>
          </div>

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeDnporAAAAAA6nNs5fZaAKOW7-k4fz3pzjpWGG" // Replace with your site key
            className="my-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
