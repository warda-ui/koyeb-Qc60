const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
