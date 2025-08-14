// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true }, // 📱 Added
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "driver"], default: "user" },
    carModel: { type: String },
    licensePlate: { type: String },
    drivingLicenseNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
