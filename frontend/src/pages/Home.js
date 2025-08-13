import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function Home() {
  return (
    <div
      className="bg-primary text-white min-vh-100 d-flex flex-column align-items-center justify-content-center text-center animate__animated animate__fadeIn"
    >
      <div className="container">
        <h1 className="display-3 fw-bold">Welcome to Carpool</h1>
        <p className="lead mb-4">
          Share rides with people attending the same event and make your journey
          cheaper, greener, and more fun.
        </p>

        <div className="row g-4 justify-content-center">
          <div className="col-10 col-md-3 animate__animated animate__fadeInUp">
            <div className="card bg-light text-dark shadow h-100">
              <div className="card-body">
                <h5 className="fw-bold">💰 Save Costs</h5>
                <p className="mb-0">Split fuel & parking with others.</p>
              </div>
            </div>
          </div>

          <div className="col-10 col-md-3 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="card bg-light text-dark shadow h-100">
              <div className="card-body">
                <h5 className="fw-bold">🤝 Meet People</h5>
                <p className="mb-0">Connect with fellow event-goers.</p>
              </div>
            </div>
          </div>

          <div className="col-10 col-md-3 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="card bg-light text-dark shadow h-100">
              <div className="card-body">
                <h5 className="fw-bold">🌍 Eco-Friendly</h5>
                <p className="mb-0">Help reduce carbon emissions.</p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="/events"
          className="btn btn-light btn-lg mt-5 shadow animate__animated animate__pulse animate__infinite"
        >
          🚗 Find an Event
        </a>
      </div>
    </div>
  );
}
