const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
