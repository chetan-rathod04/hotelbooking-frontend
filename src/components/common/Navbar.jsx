import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scroll to top after logout
  };

  // ✅ Scroll to top on route change
  const handleNavClick = (to) => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ Scroll to top
    if (menuOpen) setMenuOpen(false); // ✅ Close mobile menu
  };

  // ✅ Detect scroll for Home page
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setScrolled(window.scrollY > 80);
      } else {
        setScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // ✅ Animated underline style
  const underlineClass = `
    relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
    after:w-0 after:h-[2px] after:transition-all after:duration-300 
    hover:after:w-full
  `;

  // ✅ Reusable NavItem Component
  const NavItem = ({ to, label }) => {
    const underlineColor =
      !scrolled && location.pathname === "/"
        ? "after:bg-white text-white hover:text-white"
        : "after:bg-orange-400 text-orange-200 hover:text-orange-400";

    return (
      <NavLink
        to={to}
        onClick={() => handleNavClick(to)} // ✅ Scroll to top on click
        className={({ isActive }) =>
          `${underlineClass} ${underlineColor} transition-colors duration-200 font-medium
          ${isActive ? "after:w-full text-orange-400 font-bold" : ""}`
        }
      >
        {label}
      </NavLink>
    );
  };

  const menuLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/rooms", label: "Rooms" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/about-us", label: "About Us" },
    { to: "/hotels", label: "Hotels" },
  ];

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-500 ${
        scrolled
          ? "bg-gray-900/70 shadow-md text-white"
          : location.pathname === "/"
          ? "bg-black/10 text-white"
          : "bg-gray-900/70 shadow-md text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => handleNavClick("/")}
          className="text-2xl font-bold tracking-wide hover:text-orange-400"
          style={{ letterSpacing: "2px" }}
        >
          HotelBooking
        </NavLink>

        {/* Desktop Center Nav */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {menuLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
        </div>

        {/* Desktop Right Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!authUser ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                to="/login"
                onClick={() => handleNavClick("/login")}
                className="bg-orange-500 px-4 py-1 rounded hover:bg-orange-600 font-semibold shadow transition-all duration-150"
              >
                Login / Register
              </NavLink>
            </motion.div>
          ) : (
            <>
              {authUser.role === "ADMIN" && (
                <NavItem to="/admin-dashboard" label="Admin Dashboard" />
              )}
              {authUser.role === "USER" && (
                <NavItem to="/user-dashboard" label="User Dashboard" />
              )}

              {/* Avatar & Username */}
              <div className="flex items-center gap-2">
                {authUser.avatar && (
                  <img
                    src={`http://localhost:8080/uploads/${authUser.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
                  />
                )}
                <span className="text-sm font-semibold">
                  {authUser.username}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-black px-3 py-1 rounded hover:bg-red-600 font-semibold shadow transition-all duration-150"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 text-white flex flex-col gap-4 py-6 px-6 shadow-lg"
          >
            {menuLinks.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}

            {!authUser ? (
              <NavLink
                to="/login"
                onClick={() => handleNavClick("/login")}
                className="bg-orange-500 px-4 py-1 rounded hover:bg-orange-600 mt-2 font-semibold shadow transition-all duration-150"
              >
                Login / Register
              </NavLink>
            ) : (
              <>
                {authUser.role === "ADMIN" && (
                  <NavItem to="/admin-dashboard" label="Admin Dashboard" />
                )}
                {authUser.role === "USER" && (
                  <NavItem to="/user-dashboard" label="User Dashboard" />
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 mt-2 font-semibold shadow transition-all duration-150"
                >
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
