// EventsList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading events...</p>;

  return (
    <div className="container mt-4">
      <h2>Available Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="list-group">
          {events.map((event) => (
            <li
              key={event._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{event.eventName}</h5>
                <p className="mb-1">
                  {new Date(event.eventDate).toLocaleDateString()} at{" "}
                  {event.time} <br />
                  {event.location}
                </p>
                <small className="text-muted">
                  Created by {event.createdBy?.name || "Unknown"}
                </small>
              </div>
              <Link to={`/join/${event._id}`} className="btn btn-primary">
                View & Join
              </Link>
              <Link to={`/events/${event._id}`} className="btn btn-secondary ms-2">
                Details
              </Link>
              <Link to={`/events/edit/${event._id}`} className="btn btn-warning ms-2">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
