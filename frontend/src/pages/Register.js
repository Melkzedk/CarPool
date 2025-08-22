// Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 added useNavigate
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [carModel, setCarModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  const navigate = useNavigate(); // 👈 initialize navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        phoneNumber,
        email,
        password,
        role,
        ...(role === "driver" && {
          carModel,
          licensePlate,
          drivingLicenseNumber,
        }),
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      alert("Registration successful!"); // ✅ keep toast message
      console.log(res.data);

      navigate("/login"); // 👈 redirect after success
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 text-white">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">Normal User</option>
          <option value="driver">Driver</option>
        </select>

        {role === "driver" && (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Car Model"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="License Plate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Driving License Number"
              value={drivingLicenseNumber}
              onChange={(e) => setDrivingLicenseNumber(e.target.value)}
              required
            />
          </>
        )}

        <button className="btn btn-custom w-100">Register</button>
      </form>
      <p className="mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-white fw-bold">
          Login here
        </Link>
      </p>
    </div>
  );
}
