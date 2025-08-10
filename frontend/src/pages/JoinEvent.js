import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JoinEvent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      <h2>Join Event</h2>
      <ul className="list-group">
        {events.map(e => (
          <li key={e._id} className="list-group-item d-flex justify-content-between">
            {e.eventName} - {e.location}
            <button className="btn btn-success btn-sm">Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}