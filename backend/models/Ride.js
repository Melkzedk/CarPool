const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  origin: { type: String },
  destination: { type: String },
  departureTime: { type: String }, // could be Date if you prefer
  seatsAvailable: { type: Number, default: 1 },
  price: { type: Number },
  purpose: { type: String }, // optional tag/category

  requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],

  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
