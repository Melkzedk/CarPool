// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/notifications
// @desc    Get all notifications for the logged-in user
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name")
      .populate("event", "eventName")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/notifications/mark-read
// @desc    Mark all notifications as read
// @access  Private
router.put("/mark-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/notifications/clear
// @desc    Clear all notifications
// @access  Private
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ msg: "All notifications cleared" });
  } catch (err) {
    console.error("Error clearing notifications:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
