import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import JoinEvent from './pages/JoinEvent';
import RideRequests from './pages/RideRequests';
import Login from './pages/Login';
import Register from './pages/Register.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlusCircle, FaSignInAlt, FaCarSide, FaUserCircle } from 'react-icons/fa';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-uppercase" to="/">
            🚗 Carpool
          </Link>

          {/* Toggler for mobile */}
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
              <li className="nav-item">
                <Link className="btn btn-outline-light d-flex align-items-center gap-2" to="/account">
                  <FaUserCircle /> Account
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light d-flex align-items-center gap-2" to="/create">
                  <FaPlusCircle /> Create Ride
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light d-flex align-items-center gap-2" to="/join">
                  <FaSignInAlt /> Join Ride
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light d-flex align-items-center gap-2" to="/rides">
                  <FaCarSide /> Ride Requests
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container" style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/join" element={<JoinEvent />} />
          <Route path="/rides" element={<RideRequests />} />
          <Route path="/account" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
