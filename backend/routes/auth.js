const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, carModel, licensePlate, drivingLicenseNumber } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Role-specific validation
    if (role === "driver") {
      if (!carModel || !licensePlate || !drivingLicenseNumber) {
        return res.status(400).json({ error: "Driver must provide car details and license number" });
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      carModel: role === "driver" ? carModel : undefined,
      licensePlate: role === "driver" ? licensePlate : undefined,
      drivingLicenseNumber: role === "driver" ? drivingLicenseNumber : undefined
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
