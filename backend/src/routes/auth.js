// Authentication routes - handles login and getting current user
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData } = require('../utils/fileHelper');
const { authenticateToken } = require('../middleware/auth');

// ─────────────────────────────────────────
// POST /api/auth/login
// What it does: checks email/password, returns a token
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Read users from our JSON file
    const data = readData('users.json');
    const user = data.users.find(u => u.email === email);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (!user.active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is disabled. Contact admin.' 
      });
    }

    // Check if password matches
    // bcrypt.compare checks the plain password against the hashed one
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Password is correct! Create a JWT token
    // This token proves the user is logged in
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Send back the token and user info
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me
// What it does: returns current logged in user info
// Requires: valid token in header
// ─────────────────────────────────────────
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;