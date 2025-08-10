import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

export default function CreateRide() {
  const [form, setForm] = useState({ originLat:'', originLng:'', destLat:'', destLng:'', dateTime:'', seats:1, purpose:'' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        origin: { type: 'Point', coordinates: [parseFloat(form.originLng), parseFloat(form.originLat)] },
        destination: { type: 'Point', coordinates: [parseFloat(form.destLng), parseFloat(form.destLat)] },
        originAddress: form.originAddr,
        destinationAddress: form.destAddr,
        dateTime: form.dateTime,
        availableSeats: parseInt(form.seats),
        purpose: form.purpose
      };
      await api.post('/rides', payload);
      alert('Ride created');
      navigate('/search');
    } catch (err) { console.error(err); alert('Error creating ride'); }
  };

  return (
    <Form onSubmit={submit}>
      {/* Put inputs here - use Bootstrap form groups */}
      <Form.Group className="mb-2">
        <Form.Label>Origin latitude</Form.Label>
        <Form.Control value={form.originLat} onChange={e => setForm({...form, originLat: e.target.value})} required />
      </Form.Group>
      {/* other inputs similar */}
      <Button type="submit">Create Ride</Button>
    </Form>
  );
}
