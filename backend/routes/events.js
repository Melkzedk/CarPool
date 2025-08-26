// backend/routes/event.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event"); // Import Event model

// ✅ Create Event
router.post("/", async (req, res) => {
  try {
    const { eventName, eventDate, time, location, description } = req.body;

    if (!eventName || !eventDate || !time || !location) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      time,
      location,
      description,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while creating event",
        error: error.message,
      });
  }
});

// ✅ Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 }); // sort by date
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching events",
        error: error.message,
      });
  }
});

// ✅ Get Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while fetching event",
        error: error.message,
      });
  }
});

// ✅ Update Event
router.put("/:id", async (req, res) => {
  try {
    const { eventName, eventDate, time, location, description } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { eventName, eventDate, time, location, description },
      { new: true, runValidators: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while updating event",
        error: error.message,
      });
  }
});

// ✅ Delete Event
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while deleting event",
        error: error.message,
      });
  }
});

module.exports = router;
