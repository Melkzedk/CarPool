// pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save both token and user info with `_id`
      const userData = {
        _id: user._id,
        name: user.name,
        phone: user.phoneNumber || "",
        role: user.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);

      alert("Login successful!");
      navigate("/events");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 text-white">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
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
        <button className="btn btn-custom w-100">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account?{" "}
        <Link to="/register" className="text-white fw-bold">
          Register here
        </Link>
      </p>
    </div>
  );
}
