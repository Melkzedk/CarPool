const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// ====================
// REGISTER
// ====================
router.post("/register", async (req, res) => {
  try {
    const { 
      name, 
      phoneNumber, 
      email, 
      password, 
      role, 
      carModel, 
      licensePlate, 
      drivingLicenseNumber 
    } = req.body;

    if (!name || !phoneNumber || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (role === "driver" && (!carModel || !licensePlate || !drivingLicenseNumber)) {
      return res.status(400).json({ message: "Please provide all driver details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
      ...(role === "driver" && { carModel, licensePlate, drivingLicenseNumber }),
    });

    await newUser.save();

    // ✅ Use `_id` in JWT payload
    const token = jwt.sign(
      { _id: newUser._id, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        ...(role === "driver" && { 
          carModel: newUser.carModel, 
          licensePlate: newUser.licensePlate, 
          drivingLicenseNumber: newUser.drivingLicenseNumber 
        }),
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================
// LOGIN
// ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Use `_id` in JWT payload
    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        ...(user.role === "driver" && { 
          carModel: user.carModel, 
          licensePlate: user.licensePlate, 
          drivingLicenseNumber: user.drivingLicenseNumber 
        }),
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
