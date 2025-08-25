import React, { useState, useEffect } from "react";
import { FaGithub, FaArrowUp, FaYoutube, FaLinkedin } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Top Footer Links */}
      <footer className="footer sm:footer-horizontal bg-gray-900 text-gray-200 p-10">
        <nav>
          <h1 className="footer-title text-orange-400 ">Our Services</h1>
          <Link to="/rooms" className="link link-hover">
            Room Booking
          </Link>
          <a className="link link-hover">Hotel Management</a>
          <a className="link link-hover">Special Offers</a>
          <a className="link link-hover">Customer Support</a>
        </nav>
        <nav>
          <h6 className="footer-title text-orange-400">Company</h6>
          <Link to="/about-us" className="link link-hover">
            About Us
          </Link>
          <Link to="/contact-us" className="link link-hover">
            Contact
          </Link>
          <a className="link link-hover">Careers</a>
          <Link to="/blog" className="link link-hover">
            Blog
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title text-orange-400">Legal</h6>
          <a className="link link-hover">Terms & Conditions</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cancellation Policy</a>
        </nav>
      </footer>

      {/* Middle Footer with Socials */}
      <footer className="footer bg-gray-900 text-gray-400 border-t border-gray-700 px-10 py-4 flex justify-between items-center">
        <aside className="flex items-center gap-2">
          <svg
            style={{ animation: "spin 4s linear infinite" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current text-yellow-400 animate-spin"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>
            <b>EliteStay Hotels</b>
            <br />
            Making your stays memorable since 2024
          </p>
        </aside>

        <nav>
          <div className="flex gap-4">
            <a
              target="_blank"
              href="https://github.com/chetan-rathod04"
              aria-label="Github"
              className="hover:text-white transition"
            >
              <FaGithub className="size-7" />
            </a>
            <a
              href="#"
              target="_blank"
              aria-label="YouTube"
              className="hover:text-red-500 transition"
            >
              <FaYoutube className="size-8" />
            </a>
            <a
              href="https://www.linkedin.com/in/chetan-rathod04/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedin className="size-7" />
            </a>

            <a
              target="_blank"
              href="https://www.instagram.com/chetan_rathod410/"
              aria-label="Instagram"
              className="hover:text-pink-500 transition"
            >
              <AiFillInstagram className="size-8" />
            </a>
          </div>
        </nav>
      </footer>

      {/* Bottom Footer with Scroll Button */}
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-700 px-10 py-4 relative">
        <div className="flex justify-center">
          <p>
            Copyright © {new Date().getFullYear()} - All rights reserved by{" "}
            <b className="text-orange-400">CR Hotels</b>
          </p>
        </div>

        {showScrollButton && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-5 right-5 bg-orange-500 hover:bg-orange-600 
               text-white p-3 rounded-full shadow-lg 
               transition transform hover:scale-110 animate-bounce"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-3 h-3" />
          </motion.button>
        )}
      </footer>
    </div>
  );
};

export default Footer;
