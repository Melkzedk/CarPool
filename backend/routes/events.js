const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth'); // 🔹 Import auth middleware

// POST - Create event (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { eventName, eventDate, location } = req.body;

    if (!eventName || !eventDate || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      location,
      participants: []
    });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch all events (Protected - optional)
// If you want events to be public, remove "auth" here
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Join event (Protected)
router.post('/:id/join', auth, async (req, res) => {
  try {
    const userName = req.user.name; // 🔹 From decoded token
    if (!userName) {
      return res.status(400).json({ error: 'User name not found in token' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Prevent duplicate joining
    if (event.participants.includes(userName)) {
      return res.status(400).json({ error: 'You already joined this event' });
    }

    event.participants.push(userName);
    await event.save();

    res.json({ message: `You have joined the event: ${event.eventName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
