// Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading events...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">All Events</h2>
      <div className="row">
        {events.length === 0 ? (
          <p>No events available yet.</p>
        ) : (
          events.map((event) => (
            <div className="col-md-4 mb-3" key={event._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{event.eventName}</h5>
                  <p className="card-text">
                    <strong>Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()} <br />
                    <strong>Location:</strong> {event.location}
                  </p>
                  {/* ✅ Show who created the event */}
                  <p className="text-muted">
                    Created by:{" "}
                    {event.createdBy?.name || "Unknown"} (
                    {event.createdBy?.userId || "N/A"})
                  </p>
                  <Link
                    to={`/join/${event._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Join Our Event
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}