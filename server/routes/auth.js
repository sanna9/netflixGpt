const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const serializeUser = (user) => ({
  uid: user._id.toString(),
  email: user.email,
  displayName: user.name,
  photoURL: user.photoURL,
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, photoURL } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      photoURL,
    });

    return res.status(201).json({
      token: createToken(user._id.toString()),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create account" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    const passwordMatches = user && (await bcrypt.compare(password || "", user.password));

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: createToken(user._id.toString()),
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign in" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load user" });
  }
});

module.exports = router;
