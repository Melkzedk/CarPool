const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');

// POST /api/rides - create ride (driver)
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, origin, destination, departureTime, seatsAvailable, price, purpose } = req.body;

    if (!eventId) {
      return res.status(400).json({ msg: 'eventId is required to create a ride' });
    }

    const ride = new Ride({
      eventId,
      driver: req.user.id,     // requires your auth middleware to set req.user.id
      origin,
      destination,
      departureTime,
      seatsAvailable,
      price,
      purpose
    });

    await ride.save();
    res.json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/rides - list rides (with query filters)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.purpose) filters.purpose = req.query.purpose;
    if (req.query.eventId) filters.eventId = req.query.eventId;

    const rides = await Ride.find(filters)
      .populate('driver', 'name email');

    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/rides/:id/request - rider requests seat
router.post('/:id/request', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });

    // prevent duplicates
    const already = ride.requests.find(r => r.user.toString() === req.user.id);
    if (already) return res.status(400).json({ msg: 'Already requested' });

    ride.requests.push({ user: req.user.id });
    await ride.save();

    res.json({ msg: 'Request sent' });
  } catch (err) { 
    console.error(err); 
    res.status(500).send('Server error'); 
  }
});

// POST /api/rides/:id/requests/:reqId/respond - driver accepts/rejects
router.post('/:id/requests/:reqId/respond', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.driver.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    const r = ride.requests.id(req.params.reqId);
    if (!r) return res.status(404).json({ msg: 'Request not found' });

    r.status = action === 'accept' ? 'accepted' : 'rejected';
    if (r.status === 'accepted') {
      // add passenger and decrement seats (guard at 0)
      if (!ride.passengers.map(p => p.toString()).includes(r.user.toString())) {
        ride.passengers.push(r.user);
        ride.seatsAvailable = Math.max(0, (ride.seatsAvailable || 0) - 1);
      }
    }

    await ride.save();
    res.json(ride);
  } catch (err) { 
    console.error(err); 
    res.status(500).send('Server error'); 
  }
});

module.exports = router;
