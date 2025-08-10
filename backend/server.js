require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL }});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// make io available to routes
app.set('io', io);

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('joinRideRoom', rideId => socket.join(rideId));
  socket.on('leaveRideRoom', rideId => socket.leave(rideId));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(process.env.PORT || 5000, () => console.log('Server running on port', process.env.PORT)))
  .catch(err => console.error(err));
