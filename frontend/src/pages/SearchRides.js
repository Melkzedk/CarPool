import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function SearchRides() {
  const [rides, setRides] = useState([]);
  const [position, setPosition] = useState({ lat: -1.286389, lng: 36.817223 }); // default Nairobi

  useEffect(() => {
    async function load() {
      // 
      const res = await api.get('/rides/search', { params: { lat: position.lat, lng: position.lng, radius: 10000 }});
      setRides(res.data);
    }
    load();
  }, [position]);

  return (
    <div className="row">
      <div className="col-md-8">
        <MapContainer center={[position.lat, position.lng]} zoom={12} style={{height: '70vh'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {rides.map(r => (
            <Marker key={r._id} position={[r.origin.coordinates[1], r.origin.coordinates[0]]}>
              <Popup>
                {r.driver.name} - {r.availableSeats} seats - {new Date(r.dateTime).toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="col-md-4">
        {rides.map(r => (
          <div className="card mb-2" key={r._id}>
            <div className="card-body">
              <h5 className="card-title">{r.driver.name}</h5>
              <p>{r.originAddress || `${r.origin.coordinates[1]}, ${r.origin.coordinates[0]}`}</p>
              <p>{new Date(r.dateTime).toLocaleString()}</p>
              <button className="btn btn-primary">Request Seat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
