const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Middleware to authenticate the user using JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      status: role === 'admin' ? 'approved' : 'pending',
    });

    await newUser.save();

    res.status(201).json({ status: 'ok', message: 'Registration successful. Awaiting approval if applicable.' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Failed to register user. Please try again.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log('Login request received:', identifier);

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and Password are required' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Incorrect password');
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful, Token:', token);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
