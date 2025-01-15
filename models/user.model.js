// models/user.model.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quote: {
    type: [String],  // Array of strings
    default: [],
    validate: {
      validator: function (quotes) {
        return quotes.length <= 3;  // Limit to a maximum of 3 quotes
      },
      message: 'You can only have up to 3 quotes',
    },
  },
  
  role: {  
    type: String,
    default: 'user', // Default role is "user"
    enum: ['user', 'admin'],
  },
  status: {  // New field to track user approval status
    type: String,
    default: 'pending',  // Default status is "pending"
    enum: ['pending', 'approved', 'rejected'],  // Allowed statuses
  },
}, { timestamps: true }); // Add timestamps for user creation and updates

module.exports = mongoose.model('User', UserSchema);
