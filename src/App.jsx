import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hotels from "./pages/Hotels";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AddRoom from "./components/AddRoom";
import ContactUs from "./pages/ContactUs";
import ErrorBoundary from "./components/ErrorBoundary";
import Blog from "./pages/Blog";
import Rooms from "./pages/Rooms";
import AboutUs from "./pages/AboutUs";
import PageWrapper from "./components/PageWrapper";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import HotelDetails from "./pages/HotelDetails.jsx";
import Footer from "./components/common/Footer.jsx";

export default function App() {
  const location = useLocation();
  const [toast, setToast] = useState("");
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/hotels"
            element={
              <PageWrapper>
                <Hotels />
              </PageWrapper>
            }
          />
          <Route
            path="/bookings"
            element={
              <PageWrapper>
                <Bookings />
              </PageWrapper>
            }
          />
          <Route
            path="/admin/add-room"
            element={
              <PageWrapper>
                <AddRoom />
              </PageWrapper>
            }
          />
          <Route
            path="/contact-us"
            element={
              <PageWrapper>
                <ContactUs />
              </PageWrapper>
            }
          />
          <Route
            path="/blog"
            element={
              <PageWrapper>
                <Blog />
              </PageWrapper>
            }
          />
          <Route
            path="/rooms"
            element={
              <PageWrapper>
                <Rooms />
              </PageWrapper>
            }
          />
          <Route
            path="/hotel/:id"
            element={
              <PageWrapper>
                <HotelDetails />
              </PageWrapper>
            }
          />

          <Route
            path="/about-us"
            element={
              <PageWrapper>
                <AboutUs />
              </PageWrapper>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <PageWrapper>
                <ErrorBoundary>
                  <ProtectedRoute role="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              </PageWrapper>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <PageWrapper>
                <ErrorBoundary>
                  <ProtectedRoute role="USER">
                    <UserDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              </PageWrapper>
            }
          />
        </Routes>
        {toast && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-success">
              <span>{toast}</span>
            </div>
          </div>
        )}
      </AnimatePresence>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
}
