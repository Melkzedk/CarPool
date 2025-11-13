const mongoose = require("mongoose");

const ModelTestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    lastname: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ModelTest", ModelTestSchema);
