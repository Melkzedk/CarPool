const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create Event
router.post('/', auth, async (req, res) => {
  try {
    const { eventName, eventDate, location, description, time, seatsAvailable } = req.body;
    if (!eventName || !eventDate || !location) {
      return res.status(400).json({ error: 'Event name, date, and location are required' });
    }

    // find logged in user details
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newEvent = new Event({
      eventName,
      eventDate,
      location,
      description,
      time,
      seatsAvailable,
      participants: [],
      createdBy: {
        userId: user._id,
        name: user.name,
        phone: user.phone
      }
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
