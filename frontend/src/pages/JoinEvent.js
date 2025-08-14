import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    axios
      .get("http://localhost:5000/api/events", {
        headers: { "x-auth-token": token },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch events.");
      });
  }, [navigate]);

  const handleJoin = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return navigate("/login");
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/events/${id}/join`,
        {},
        { headers: { "x-auth-token": token } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Join Event</h2>
      <div className="row">
        {events.length > 0 ? (
          events.map((e) => (
            <div key={e._id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{e.eventName}</h5>
                  <p className="card-text mb-1">
                    <strong>Location:</strong> {e.location}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Date:</strong> {new Date(e.eventDate).toLocaleDateString()}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Time:</strong> {e.time || "Not specified"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Description:</strong> {e.description || "No description"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Seats Available:</strong> {e.seatsAvailable ?? "N/A"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Contact:</strong> {e.createdBy?.phone || "N/A"}
                  </p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleJoin(e._id)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
}
