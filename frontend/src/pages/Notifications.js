import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    await axios.put(
      "http://localhost:5000/api/notifications/mark-read",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotifications();
  };

  const clearNotifications = async () => {
    const token = localStorage.getItem("token");
    await axios.delete("http://localhost:5000/api/notifications/clear", {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  return (
    <div className="container mt-4">
      <h2>Notifications</h2>

      <div className="mb-3">
        <button className="btn btn-sm btn-outline-primary me-2" onClick={markAllAsRead}>
          Mark All as Read
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={clearNotifications}>
          Clear Notifications
        </button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`list-group-item ${n.read ? "text-muted" : ""}`}
            >
              <strong>{n.sender?.name}</strong> {n.message} <br />
              <small className="text-muted">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
