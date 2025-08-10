const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req,res)=>{
  try{
    const { name,email,password,role } = req.body;
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name,email,password,role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err,token)=>{
      if(err) throw err; res.json({ token });
    });
  } catch(err){
    console.error(err.message); res.status(500).send('Server error');
  }
});

// POST /api/auth/login
router.post('/login', async (req,res)=>{
  try{
    const { email,password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err,token)=>{
      if(err) throw err; res.json({ token });
    });
  } catch(err){ console.error(err.message); res.status(500).send('Server error'); }
});

module.exports = router;