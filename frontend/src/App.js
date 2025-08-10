import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Finance Tracker</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">Add Transaction</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">Reports</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
