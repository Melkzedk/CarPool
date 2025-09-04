// routes/event.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const Notification = require("../models/Notification"); // ✅ import notification model
const authMiddleware = require("../middleware/auth");

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      time,
      location,
      description,
      seatsAvailable,
      estimatedCost,
    } = req.body;

    if (!eventName || !eventDate || !time || !location) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    // ✅ Fetch user info to fill createdBy
    const user = await User.findById(req.user._id).select("name phone");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      time,
      location,
      description,
      seatsAvailable,
      estimatedCost,
      createdBy: {
        userId: user._id,
        name: user.name,
        phone: user.phone,
      },
      participants: [],
      pendingRequests: [], // ✅ new
    });

    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error("Event creation error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/events/:id/join
// @desc    Request to join an event (goes to pendingRequests)
// @access  Private
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // ✅ prevent duplicates
    if (
      event.pendingRequests.includes(req.user._id) ||
      event.participants.includes(req.user._id)
    ) {
      return res.status(400).json({ msg: "You already requested or joined" });
    }

    // ✅ Add to pending requests
    event.pendingRequests.push(req.user._id);
    await event.save();

    // ✅ Fetch user who requested
    const user = await User.findById(req.user._id).select("name");
    if (user) {
      // ✅ Create notification for event creator
      const notification = new Notification({
        recipient: event.createdBy.userId, // creator's ID
        sender: req.user._id, // requester
        event: event._id,
        message: `${user.name} requested to join your event: ${event.eventName}`,
      });
      await notification.save();
    }

    res.json({ msg: "Join request sent successfully", event });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/events/notifications
// @desc    Get all notifications for logged-in user
// @access  Private
router.get("/notifications", authMiddleware, async (req, res) => {
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

module.exports = router;
