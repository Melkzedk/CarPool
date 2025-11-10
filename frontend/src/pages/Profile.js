// Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="card shadow p-4">
      <h3 className="mb-3">My Profile</h3>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phoneNumber}</p>
      <p><strong>Roles:</strong> {user.role}</p>
      /* <p><strong>Test</strong> {user.Test}</p> */
      {/* <p><strong>Designation</strong>{user.Designation}</p> */}

      {/* Show driver details only if role is driver */}
      {user.role === "driver" && (
        <>
          <hr />
          <h5 className="mb-2">Driver Details</h5>
          <p><strong>Car Model:</strong> {user.carModel}</p>
          <p><strong>License Plate:</strong> {user.licensePlate}</p>
          <p><strong>Driving License:</strong> {user.drivingLicenseNumber}</p>
        </>
      )}
    </div>
  );
}
