import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import JoinEvent from './pages/JoinEvent';
import RideRequests from './pages/RideRequests';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Carpool</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/create">Create Event</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/join">Join Event</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/rides">Ride Requests</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/join" element={<JoinEvent />} />
          <Route path="/rides" element={<RideRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;