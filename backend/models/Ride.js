const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String },
  seatsAvailable: { type: Number, default: 0 },
  price: { type: Number }, // ✅ add price field
  purpose: { type: String },
  driver: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

module.exports = mongoose.model("Ride", RideSchema);
