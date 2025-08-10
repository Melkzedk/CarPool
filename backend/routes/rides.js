const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ride = require('../models/Ride');

// POST /api/rides - create ride (driver)
router.post('/', auth, async (req,res)=>{
  try{
    const data = req.body;
    data.driver = req.user.id;
    const ride = new Ride(data);
    await ride.save();
    res.json(ride);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// GET /api/rides - list rides (with query filters)
router.get('/', async (req,res)=>{
  // support ?originLat=&originLng=&destLat=&destLng=&date=&purpose=
  const filters = {};
  if(req.query.purpose) filters.purpose = req.query.purpose;
  // for simplicity return all for now
  const rides = await Ride.find().populate('driver','name email');
  res.json(rides);
});

// POST /api/rides/:id/request - rider requests seat
router.post('/:id/request', auth, async (req,res)=>{
  try{
    const ride = await Ride.findById(req.params.id);
    if(!ride) return res.status(404).json({ msg: 'Ride not found' });
    // add request
    ride.requests.push({ user: req.user.id });
    await ride.save();
    res.json({ msg: 'Request sent' });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// POST /api/rides/:id/requests/:reqId/respond - driver accepts/rejects
router.post('/:id/requests/:reqId/respond', auth, async (req,res)=>{
  try{
    const { action } = req.body; // 'accept' or 'reject'
    const ride = await Ride.findById(req.params.id);
    if(!ride) return res.status(404).json({ msg: 'Ride not found' });
    if(ride.driver.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    const r = ride.requests.id(req.params.reqId);
    if(!r) return res.status(404).json({ msg: 'Request not found' });
    r.status = action === 'accept' ? 'accepted' : 'rejected';
    if(r.status === 'accepted'){
      ride.passengers.push(r.user);
      ride.seatsAvailable = Math.max(0, ride.seatsAvailable - 1);
    }
    await ride.save();
    res.json(ride);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;