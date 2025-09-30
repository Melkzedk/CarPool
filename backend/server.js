// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Debug: log every incoming request
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`, req.body);
  next();
});

// Routes
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const ridesRoutes = require('./routes/rides');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/user'); // ✅ Import user routes

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes); // ✅ Changed to plural "users"

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
