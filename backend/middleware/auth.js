//middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Check both Authorization: Bearer <token> and x-auth-token
  let token = null;

  if (req.header("Authorization")) {
    const parts = req.header("Authorization").split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    token = req.header("x-auth-token") || req.cookies?.token;
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};
