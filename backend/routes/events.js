// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const auth = require("../middleware/auth");

// ✅ Create Event
router.post("/", auth, async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventTime, // ⏰ keep naming consistent
      location,
      description,
      seatsAvailable
    } = req.body;

    if (!eventName || !eventDate || !location) {
      return res
        .status(400)
        .json({ error: "Event name, date, and location are required" });
    }

    // Find the logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create new event with nested creator info
    const newEvent = new Event({
      eventName,
      eventDate,
      eventTime,
      location,
      description,
      seatsAvailable: seatsAvailable || null,
      participants: [],
      createdBy: {
        userId: user._id,
        name: user.name,
        phone: user.phoneNumber
      }
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Events
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find(); // no populate needed for nested object
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Join Event
router.post("/:id/join", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if already joined
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ error: "You already joined this event" });
    }

    // Optional: check seat availability
    if (
      event.seatsAvailable !== null &&
      event.participants.length >= event.seatsAvailable
    ) {
      return res.status(400).json({ error: "No seats available" });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.json({ message: "Joined event successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
