const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// POST - Create event
router.post('/', async (req, res) => {
  try {
    const { eventName, eventDate, location } = req.body;

    if (!eventName || !eventDate || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEvent = new Event({ eventName, eventDate, location });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
