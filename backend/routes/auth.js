const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

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

module.exports = router;
