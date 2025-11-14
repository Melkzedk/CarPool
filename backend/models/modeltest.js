const mongoose = require("mongoose");

const ModelTestSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    lastname: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    test: {type: string},
    age: { type: Number, required: true },
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
