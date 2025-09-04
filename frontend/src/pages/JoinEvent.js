// pages/JoinEvent.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function JoinEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // assuming this contains _id or id

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setLoading(false);
      }
    };

    if (token) {
      fetchEvent();
    } else {
      navigate("/login");
    }
  }, [id, token, navigate]);

  const handleJoin = async () => {
    if (!user || !token) {
      alert("Please login to join the event.");
      return navigate("/login");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("You have successfully joined the event!");
      navigate("/");
    } catch (err) {
      console.error("Error joining event:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to join event. Please try again."
      );
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-center mt-5">Event not found.</p>;
  }

  const isCreator = user && event.createdBy?._id === user._id;

  return (
    <div className="container mt-4">
      <h2>{event.eventName}</h2>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(event.eventDate).toLocaleDateString()} <br />
        <strong>Location:</strong> {event.location}
      </p>
      <p>{event.description}</p>

      <p className="text-muted">
        Created by: {event.createdBy?.name || "Unknown"} (
        {event.createdBy?.userId || "N/A"})
      </p>

      {!isCreator && (
        <button
          onClick={handleJoin}
          className="btn btn-custom"
          disabled={
            event.seatsAvailable !== undefined && event.seatsAvailable <= 0
          }
        >
          {event.seatsAvailable !== undefined && event.seatsAvailable <= 0
            ? "No Seats Available"
            : "Join Event"}
        </button>
      )}

      {isCreator && (
        <p className="text-danger">You cannot join your own event.</p>
      )}
    </div>
  );
}
