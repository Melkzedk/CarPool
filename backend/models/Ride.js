const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
});

const RideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: PointSchema, required: true },
  destination: { type: PointSchema, required: true },
  originAddress: String,
  destinationAddress: String,
  dateTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  purpose: { type: String }, // Work, School, Event, Other
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', RideSchema);
