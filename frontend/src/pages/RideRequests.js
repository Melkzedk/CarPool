import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function RideRequests() {
  const [rides, setRides] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/rides${eventId ? `?eventId=${eventId}` : ""}`,
          token ? { headers: { "x-auth-token": token } } : {}
        );
        setRides(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load rides.");
      }
    };
    fetchRides();
  }, [eventId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Ride Requests</h2>
      {eventId && <p className="text-muted">Showing rides for event: {eventId}</p>}
      {rides.length > 0 ? (
        <ul className="list-group">
          {rides.map((ride) => (
            <li key={ride._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{ride.origin}</strong> → <strong>{ride.destination}</strong>
                <div className="small text-muted">
                  {ride.departureTime ? `Departs: ${ride.departureTime}` : ""}
                  {ride.price ? ` • Price: ${ride.price}` : ""}
                </div>
              </div>
              <span className="badge bg-primary rounded-pill">
                {ride.seatsAvailable} seats left
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
