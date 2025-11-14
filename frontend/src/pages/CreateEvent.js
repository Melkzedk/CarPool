//pages/CreateEvent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      alert("You must be logged in to create an event.");
      navigate("/login");
    }
    setUserRole(role);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events",
        {
          eventName,
          eventDate,
          time,
          location,
          description,
          ...(userRole === "driver" && { seatsAvailable }),
          ...(userRole === "user" && { estimatedCost }),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Event created!");
      navigate(`/join/${res.data._id}`);
    } catch (err) {
      console.error("Create event error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to create event");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          type="date"
          className="form-control mb-2"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="form-control mb-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {userRole === "driver" && (
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Seats Available"
            value={seatsAvailable}
            onChange={(e) => setSeatsAvailable(e.target.value)}
            required
          />
        )}

        {userRole === "user" && (
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Estimated Cost (for cost sharing)"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            required
          />
        )}

        <button className="btn btn-custom w-100">Create</button>
      </form>
    </div>
  );
}
