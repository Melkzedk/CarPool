// routes/event.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const Notification = require("../models/Notification"); 
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

    // Fetch user info for createdBy
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
      pendingRequests: [],
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
// @desc    Request to join an event (adds to pendingRequests)
// @access  Private
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // prevent duplicates
    if (
      event.pendingRequests.includes(req.user._id) ||
      event.participants.includes(req.user._id)
    ) {
      return res.status(400).json({ msg: "You already requested or joined" });
    }

    // Add to pending requests
    event.pendingRequests.push(req.user._id);
    await event.save();

    // Fetch user who requested
    const user = await User.findById(req.user._id).select("name");
    if (user) {
      // Create notification for event creator
      const notification = new Notification({
        recipient: event.createdBy.userId, 
        sender: req.user._id, 
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

// @route   POST /api/events/:id/accept
// @desc    Event creator accepts a join request
// @access  Private
router.post("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body; // requester’s ID
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (!event.pendingRequests.includes(userId)) {
      return res.status(400).json({ msg: "User did not request to join" });
    }

    // Move user from pendingRequests → participants
    event.pendingRequests = event.pendingRequests.filter(
      (id) => id.toString() !== userId
    );
    event.participants.push(userId);
    await event.save();

    // Notify requester
    const notification = new Notification({
      recipient: userId,
      sender: req.user._id,
      event: event._id,
      message: `Your request to join "${event.eventName}" was accepted ✅`,
    });
    await notification.save();

    res.json({ msg: "User accepted", event });
  } catch (err) {
    console.error("Error accepting request:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/events/:id/decline
// @desc    Event creator declines a join request
// @access  Private
router.post("/:id/decline", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body; // requester’s ID
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Remove user from pendingRequests
    event.pendingRequests = event.pendingRequests.filter(
      (id) => id.toString() !== userId
    );
    await event.save();

    // Notify requester
    const notification = new Notification({
      recipient: userId,
      sender: req.user._id,
      event: event._id,
      message: `Your request to join "${event.eventName}" was declined ❌`,
    });
    await notification.save();

    res.json({ msg: "User declined", event });
  } catch (err) {
    console.error("Error declining request:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
