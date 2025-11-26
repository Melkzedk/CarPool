// backend/models/modeltest.js

const mongoose = require("mongoose");

const ModelTestSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    lastname: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    age: { type: Number, required: true },
    test: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    phone: { type: String },
    registeredAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ModelTest", ModelTestSchema);
