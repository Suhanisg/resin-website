const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = express.Router();

// timing attack se bachne ke liye safe comparison
const safeEqual = (a = "", b = "") => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    console.error("Admin auth env variables set nahi hain");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const emailOk = safeEqual(
    String(email || "").trim().toLowerCase(),
    ADMIN_EMAIL.trim().toLowerCase()
  );
  const passOk = safeEqual(password, ADMIN_PASSWORD);

  if (!emailOk || !passOk) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, expiresIn: 86400 });
});

module.exports = router;