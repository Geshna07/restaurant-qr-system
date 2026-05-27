// This file protects routes that require login
// It checks if the request has a valid JWT token

const jwt = require('jsonwebtoken');

// This function runs BEFORE protected route handlers
const authenticateToken = (req, res, next) => {
  // Get the token from request headers
  // Frontend sends it like: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get part after "Bearer "

  // If no token found, reject the request
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. Please login first.' 
    });
  }

  // Verify the token is valid and not expired
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token. Please login again.' 
      });
    }
    
    // Token is valid! Attach user info to request
    req.user = user;
    next(); // Move on to the actual route handler
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

// Middleware to check if user is staff or admin
const requireStaff = (req, res, next) => {
  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Staff only.' 
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, requireStaff };