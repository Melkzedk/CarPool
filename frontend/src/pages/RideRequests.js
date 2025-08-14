import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function RideRequests() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ GET request with token & query param
        const res = await axios.get("http://localhost:5000/api/rides", {
          headers: token ? { "x-auth-token": token } : {},
          params: eventId ? { eventId } : {},
        });

        setRides(res.data || []);
      } catch (err) {
        console.error("Error fetching rides:", err);
        alert(err.response?.data?.msg || "Failed to load rides.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [eventId]);

  if (loading) {
    return <div className="container mt-4">Loading rides...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Ride Requests</h2>
      {eventId && (
        <p className="text-muted">Showing rides for event: {eventId}</p>
      )}

      {rides.length > 0 ? (
        <ul className="list-group">
          {rides.map((ride) => (
            <li
              key={ride._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{ride.origin}</strong> → <strong>{ride.destination}</strong>
                <div className="small text-muted">
                  {ride.departureTime && `Departs: ${ride.departureTime}`}
                  {ride.price && ` • Price: ${ride.price}`}
                  {ride.purpose && ` • Purpose: ${ride.purpose}`}
                  {ride.driver?.name && ` • Driver: ${ride.driver.name}`}
                </div>
              </div>
              <span className="badge bg-primary rounded-pill">
                {ride.seatsAvailable ?? "N/A"} seats left
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rides available for this event yet.</p>
      )}
    </div>
  );
}
