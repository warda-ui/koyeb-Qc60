// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to verify JWT and check if user is authenticated
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, 'secret123', async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    req.userId = decoded.id;

    try {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.status === 'pending' && user.role === 'user') {
        // Redirect pending users to a temporary dashboard
        return res.status(403).json({ redirect: '/temporary-dashboard', message: 'User approval pending' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to authenticate token' });
    }
  });
};

// Middleware to check the role of the authenticated user
const checkRole = (requiredRole) => (req, res, next) => {
  if (req.user && req.user.role === requiredRole) {
    next(); // User has the required role, proceed
  } else {
    res.status(403).json({ error: 'Forbidden: You do not have access' });
  }
};

// Middleware to notify admin of pending users (to be used in admin dashboard routes)
const checkPendingUsers = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' });
    req.pendingUsers = pendingUsers;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending users' });
  }
};

module.exports = { verifyToken, checkRole, checkPendingUsers };
