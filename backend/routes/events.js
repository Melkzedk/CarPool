const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ✅ Create Event
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { eventName, eventDate, time, location, description, seatsAvailable, estimatedCost } = req.body;

    if (!eventName || !eventDate || !time || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // get logged-in user from token
    const user = await User.findById(req.user.id).select("name phoneNumber role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      time,
      location,
      description,
      ...(user.role === "driver" && { seatsAvailable }),
      ...(user.role === "user" && { estimatedCost }),
      createdBy: {
        userId: user._id,
        name: user.name,
        phone: user.phoneNumber,
      },
      participants: [],
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating event", error: error.message });
  }
});

// ✅ Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching events", error: error.message });
  }
});

// ✅ Get Single Event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching event", error: error.message });
  }
});

// ✅ Join Event
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // ❌ Prevent creator from joining
    if (event.createdBy.userId.toString() === userId) {
      return res.status(400).json({ message: "Creators cannot join their own event" });
    }

    // ❌ Prevent duplicate join
    if (event.participants.some((p) => p.toString() === userId)) {
      return res.status(400).json({ message: "User already joined this event" });
    }

    // ✅ If driver event, reduce seats
    if (event.seatsAvailable !== undefined) {
      if (event.seatsAvailable <= 0) {
        return res.status(400).json({ message: "No seats available" });
      }
      event.seatsAvailable -= 1;
    }

    event.participants.push(userId);
    await event.save();

    res.json({ message: "Successfully joined event", event });
  } catch (error) {
    res.status(500).json({ message: "Error joining event", error: error.message });
  }
});

module.exports = router;
