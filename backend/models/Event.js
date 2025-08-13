const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  participants: [{ type: String }] // store participant names or IDs
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
