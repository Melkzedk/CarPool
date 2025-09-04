const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // event creator
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the one who joined
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
