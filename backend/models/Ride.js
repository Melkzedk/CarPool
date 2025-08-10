const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number
});

const RideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  origin: StopSchema,
  destination: StopSchema,
  via: [StopSchema],
  date: Date,
  time: String,
  seatsAvailable: Number,
  pricePerSeat: Number,
  purpose: { type: String, enum: ['Work','School','Event','Other'], default: 'Other' },
  requests: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: { type: String, enum:['pending','accepted','rejected'], default:'pending' }}],
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
