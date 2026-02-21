const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });

  res.json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, username },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
