const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Driver','Rider','Both'], default: 'Rider' },
  car: {
    model: String,
    seats: { type: Number, default: 4 },
    plate: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
