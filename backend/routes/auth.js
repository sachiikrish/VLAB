import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { username, password, classLevel } = req.body;
    
    if (!username || !password || !classLevel) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const trimmedUsername = username.trim();
    const key = trimmedUsername.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ username: key });
    if (existingUser) {
      return res.status(400).json({ error: "That username is already taken. Try another one." });
    }

    // Hash password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
      username: key,
      displayName: trimmedUsername,
      password: hashedPassword,
      classLevel: Number(classLevel)
    });

    await newUser.save();

    // Match frontend expected response format
    res.status(201).json({ 
      user: { name: newUser.displayName, classLevel: newUser.classLevel } 
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// SIGNIN ROUTE
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Please enter username and password." });
    }

    const key = username.trim().toLowerCase();
    const user = await User.findOne({ username: key });

    if (!user) {
      return res.status(400).json({ error: "Wrong username or password." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong username or password." });
    }

    // Match frontend expected response format
    res.json({ 
      user: { name: user.displayName, classLevel: user.classLevel } 
    });

  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

export default router;