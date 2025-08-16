import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JoinEvent() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();

  // ✅ Get current logged-in user
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
      })
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
      navigate(`/rides?eventId=${id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleSearchClick = () => {
    if (search.trim() === "") {
      setFilteredEvents(events);
    } else {
      const q = search.toLowerCase();
      const filtered = events.filter(
        (e) =>
          e.eventName?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Join Event</h2>

      {/* 🔍 Search bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search events by name, location, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        />
        <button className="btn btn-primary" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      <div className="row">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((e) => (
            <div key={e._id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{e.eventName}</h5>
                  <p className="card-text mb-1">
                    <strong>Location:</strong> {e.location}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(e.eventDate).toLocaleDateString()}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Time:</strong> {e.eventTime || "Not specified"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Description:</strong> {e.description || "No description"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Seats Available:</strong> {e.seatsAvailable ?? "N/A"}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Contact:</strong>{" "}
                    {e.createdBy?.phoneNumber || "N/A"}
                  </p>

                  <div className="mt-auto">
                    {currentUser && e.createdBy?._id === currentUser._id ? (
                      <button className="btn btn-secondary w-100" disabled>
                        You created this event
                      </button>
                    ) : (
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleJoin(e._id)}
                      >
                        Join & View Rides
                      </button>
                    )}
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
