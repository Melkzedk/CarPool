import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'http://localhost:5000/api/events',
        { eventName, eventDate, location },
        { headers: { "x-auth-token": token } }
      );
      alert('Event created!');
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <input type="date" className="form-control mb-2" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        <input className="form-control mb-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
