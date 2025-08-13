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

    const newEvent = new Event({ eventName, eventDate, location, participants: [] });
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

// POST - Join event
router.post('/:id/join', async (req, res) => {
  try {
    const { name } = req.body; // In real app, get from auth user
    if (!name) return res.status(400).json({ error: 'Name is required to join event' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Prevent duplicate joining
    if (event.participants.includes(name)) {
      return res.status(400).json({ error: 'You already joined this event' });
    }

    event.participants.push(name);
    await event.save();

    res.json({ message: `You have joined the event: ${event.eventName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
