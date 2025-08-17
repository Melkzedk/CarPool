const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    time: { type: String }, // optional
    location: { type: String, required: true },
    description: { type: String }, // optional
    seatsAvailable: { type: Number }, // optional
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 👈 use ObjectId for consistency
    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
