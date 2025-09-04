// routes/user.js

const express = require("express");
const auth = require("../middleware/auth"); // ✅ fixed import
const User = require("../models/User");

const router = express.Router();

// Get logged-in user profile
router.get("/me", auth, async (req, res) => {
  try {
    // ✅ Use _id instead of id
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
