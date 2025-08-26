// routes/event.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
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
      createdBy,
    } = req.body;

    if (!eventName || !eventDate || !time || !location) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      time,
      location,
      description,
      seatsAvailable,
      estimatedCost,
      createdBy,
      participants: [],
    });

    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    console.error(err.message);
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
// @desc    Join an event
// @access  Private
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: "You already joined this event" });
    }

    event.participants.push(req.user.id);

    // Reduce seats if applicable
    if (event.seatsAvailable !== undefined && event.seatsAvailable > 0) {
      event.seatsAvailable -= 1;
    }

    await event.save();

    res.json({ msg: "Successfully joined the event", event });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
