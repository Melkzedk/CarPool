import React, { useState } from 'react';
import axios from 'axios';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/events', { eventName, eventDate, location });
    alert('Event created!');
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