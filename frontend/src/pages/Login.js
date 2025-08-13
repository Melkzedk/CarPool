import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend endpoint
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      alert('Login successful!');
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
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
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="mt-3 text-white">
  Don't have an account?{' '}
  <Link to="/register" className="text-white fw-bold">
    Register here
  </Link>
</p>
    </div>
  );
}
