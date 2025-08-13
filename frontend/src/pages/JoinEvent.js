import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JoinEvent() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState(''); // For demo, user enters name

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleJoin = async (id) => {
    try {
      if (!name.trim()) {
        alert('Please enter your name before joining');
        return;
      }
      const res = await axios.post(`http://localhost:5000/api/events/${id}/join`, { name });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Join Event</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
