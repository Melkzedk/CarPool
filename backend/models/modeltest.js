const mongoose = require("mongoose");

const ModelTestSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    lastname: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ModelTest", ModelTestSchema);
