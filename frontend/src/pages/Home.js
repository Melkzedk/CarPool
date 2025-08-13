import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function Home() {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 animate__animated animate__fadeIn">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Carpool</h1>
          <p className="lead">
            Share rides with people attending the same event and save money while helping the environment.
          </p>
          <a href="/events" className="btn btn-light btn-lg mt-3 shadow">
            Find an Event
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="container my-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow h-100 animate__animated animate__fadeInUp">
              <div className="card-body">
                <h5 className="card-title fw-bold">Save Costs</h5>
                <p className="card-text">
                  Split fuel and parking expenses with fellow event-goers.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 animate__animated animate__fadeInUp animate__delay-1s">
              <div className="card-body">
                <h5 className="card-title fw-bold">Meet People</h5>
                <p className="card-text">
                  Connect with others who share your destination and interests.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="card-body">
                <h5 className="card-title fw-bold">Eco-Friendly</h5>
                <p className="card-text">
                  Reduce carbon emissions by sharing rides instead of driving alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-light py-5 animate__animated animate__fadeInUp">
        <div className="container">
          <h2 className="fw-bold">Ready to Start?</h2>
          <p className="lead">
            Join our community of ride-sharers and make your next trip better.
          </p>
          <a href="/register" className="btn btn-primary btn-lg shadow">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
