import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function Home() {
  return (
    <div
      className="bg-primary text-white vh-100 d-flex flex-column align-items-center justify-content-center text-center animate__animated animate__fadeIn"
      style={{ overflow: "hidden" }}
    >
      <div className="container">
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
          Welcome to Carpool
        </h1>
        <p className="mb-3" style={{ fontSize: "1.1rem" }}>
          Share rides with people attending the same event — cheaper, greener, and more fun.
        </p>

        {/* Features */}
        <div className="row g-3 justify-content-center">
          <div className="col-4 animate__animated animate__fadeInUp">
            <div className="card bg-light text-dark shadow-sm h-100">
              <div className="card-body p-3">
                <h6 className="fw-bold">💰 Save Costs</h6>
                <p className="small mb-0">Split fuel & parking expenses.</p>
              </div>
            </div>
          </div>

          <div className="col-4 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="card bg-light text-dark shadow-sm h-100">
              <div className="card-body p-3">
                <h6 className="fw-bold">🤝 Meet People</h6>
                <p className="small mb-0">Connect with fellow event-goers.</p>
              </div>
            </div>
          </div>

          <div className="col-4 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="card bg-light text-dark shadow-sm h-100">
              <div className="card-body p-3">
                <h6 className="fw-bold">🌍 Eco-Friendly</h6>
                <p className="small mb-0">Reduce carbon emissions together.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <Link
          to="/join"   // ✅ Directs to JoinEvent.js
          className="btn btn-light btn-sm mt-3 shadow animate__animated animate__pulse animate__infinite"
        >
          🚗 Find an Event/Events
        </Link>
      </div>
    </div>
  );
}
