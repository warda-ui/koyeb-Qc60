const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const User = require('../models/user.model'); // assuming user model is stored here
const jwt = require('jsonwebtoken');

// Middleware to authenticate the user using JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user); // send back user data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true });
    res.json(updatedUser); // send back updated user data
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
