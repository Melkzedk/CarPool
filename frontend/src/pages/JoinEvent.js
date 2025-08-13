import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JoinEvent() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to join an event.");
      navigate("/login");
      return;
    }

    axios.get('http://localhost:5000/api/events', {
      headers: { "x-auth-token": token }
    })
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/events/${id}/join`,
        {}, // body
        { headers: { "x-auth-token": token } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Join Event</h2>
      <ul className="list-group">
        {events.map(e => (
          <li key={e._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{e.eventName} - {e.location}</span>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleJoin(e._id)}
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
