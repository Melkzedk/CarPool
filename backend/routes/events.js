const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // We'll create this model

// POST create event
router.post('/', async (req, res) => {
  try {
    const { eventName, eventDate, location } = req.body;
    const newEvent = new Event({ eventName, eventDate, location });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
