const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// =======================
// Create Events
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { eventName, eventDate, time, location, description, seatsAvailable } = req.body;

    // get logged-in user from JWT
    const user = await User.findById(req.user.id).select("name phoneNumber");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      time,
      location,
      description,
      seatsAvailable,
      createdBy: {
        userId: user._id,
        name: user.name,
        phone: user.phoneNumber
      },
      participants: []
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Error creating event", error: error.message });
  }
});

// =======================
// Get all events
// =======================
router.get("/", async (_req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

// =======================
// Get events created by a specific user
// =======================
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ "createdBy.userId": userId }).sort({ createdAt: -1 });
    return res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(500).json({ message: "Error fetching user events", error: error.message });
  }
});

// =======================
// Get a single event
// =======================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Error fetching event", error: error.message });
  }
});

// =======================
// Join Event
// =======================
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ get from token instead of frontend

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.participants.some((p) => p.toString() === String(userId))) {
      return res.status(400).json({ message: "User already joined this event" });
    }

    event.participants.push(userId);
    await event.save();

    return res.json({ message: "Successfully joined event", event });
  } catch (error) {
    console.error("Error joining event:", error);
    return res.status(500).json({ message: "Error joining event", error: error.message });
  }
});

module.exports = router;
