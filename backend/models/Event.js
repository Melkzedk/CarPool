const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    time: { type: String }, // HH:MM string
    location: { type: String, required: true },
    description: { type: String },
    seatsAvailable: { type: Number }, // for drivers
    estimatedCost: { type: Number },  // for normal users
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
