const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Create ride (driver)
router.post('/', auth, async (req, res) => {
  try {
    const { origin, destination, originAddress, destinationAddress, dateTime, availableSeats, purpose, price } = req.body;
    const ride = new Ride({
      driver: req.user.id,
      origin,
      destination,
      originAddress,
      destinationAddress,
      dateTime,
      availableSeats,
      purpose,
      price
    });
    await ride.save();
    // broadcast new ride to clients
    const io = req.app.get('io');
    io.emit('newRide', ride);
    res.json(ride);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Search rides: simple example: find rides near an origin within radius and time window
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, start = Date.now(), end = Date.now() + 1000*60*60*24 } = req.query;
    // find rides whose origin is within radius (meters) of provided point and time between start & end
    const rides = await Ride.find({
      origin: {
        $nearSphere: { $geometry: { type: "Point", coordinates: [ parseFloat(lng), parseFloat(lat) ] }, $maxDistance: parseInt(radius) }
      },
      dateTime: { $gte: new Date(parseInt(start)), $lte: new Date(parseInt(end)) }
    }).populate('driver', 'name car');
    res.json(rides);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Book a seat
router.post('/:id/book', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.availableSeats <= 0) return res.status(400).json({ msg: 'No seats' });
    if (ride.passengers.includes(req.user.id)) return res.status(400).json({ msg: 'Already booked' });

    ride.passengers.push(req.user.id);
    ride.availableSeats -= 1;
    await ride.save();

    // notify driver/other passengers via Socket.IO
    const io = req.app.get('io');
    io.to(ride._id.toString()).emit('rideUpdated', ride);
    io.emit('rideUpdated', ride); // also global
    res.json(ride);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
