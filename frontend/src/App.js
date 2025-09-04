// App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import JoinEvent from "./pages/JoinEvent";
import RideRequests from "./pages/RideRequests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventsList from "./pages/EventsList";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile"; // ✅ new Profile page
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPlusCircle,
  FaSignInAlt,
  FaCarSide,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");

  // Fetch notifications on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNotifications(res.data))
        .catch((err) =>
          console.error("Error fetching notifications:", err)
        );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-uppercase" to="/">
            🚗 Carpool
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-2">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/create"
                    >
                      <FaPlusCircle /> Create Ride
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/events"
                    >
                      <FaSignInAlt /> Join Ride
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/rides"
                    >
                      <FaCarSide /> Ride Requests
                    </Link>
                  </li>
                  {/* ✅ Notifications icon with badge */}
                  <li className="nav-item position-relative">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/notifications"
                    >
                      <FaBell /> Notifications
                      {notifications.length > 0 && (
                        <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                          {notifications.length}
                        </span>
                      )}
                    </Link>
                  </li>
                  {/* ✅ Profile link */}
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/profile"
                    >
                      <FaUserCircle /> Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/login"
                    >
                      <FaUserCircle /> Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      to="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container" style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/join/:id" element={<JoinEvent />} />
          <Route path="/rides" element={<RideRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} /> {/* ✅ new profile route */}
        </Routes>
      </div>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
