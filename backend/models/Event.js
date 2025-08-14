const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String }, // optional
  time: { type: String }, // optional
  seatsAvailable: { type: Number }, // optional
  participants: [{ type: String }],
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
