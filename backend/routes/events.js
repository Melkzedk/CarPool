// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ Create event
router.post("/", async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      location,
      description,
      time,             // 👈 must match schema
      seatsAvailable,
      createdBy,        // { userId, name, phone }
    } = req.body;

    if (!createdBy?.userId || !createdBy?.name || !createdBy?.phone) {
      return res.status(400).json({ message: "Missing creator details" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      location,
      description,
      time,
      seatsAvailable,
      createdBy,
      participants: [], // 👈 ensure it's always initialized
    });

    const savedEvent = await newEvent.save();
    // 👇 send back full event (with _id)
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
});

// ✅ Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

// ✅ Get a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
});

// ✅ Join an event
router.post("/:id/join", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // prevent duplicates
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: "User already joined this event" });
    }

    event.participants.push(userId);
    await event.save();

    res.json({ message: "Successfully joined event", event });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ message: "Error joining event", error: error.message });
  }
});

// ✅ Get events created by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ "createdBy.userId": userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Error fetching user events", error: error.message });
  }
});

module.exports = router;
