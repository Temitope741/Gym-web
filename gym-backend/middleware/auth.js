const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Check if membership is active
exports.checkMembership = async (req, res, next) => {
  if (req.user.membershipStatus !== 'Active') {
    return res.status(403).json({ 
      message: 'Your membership is not active. Please renew to access this feature.' 
    });
  }
  
  const expiryDate = new Date(req.user.membershipExpiry);
  const today = new Date();
  
  if (expiryDate < today) {
    req.user.membershipStatus = 'Expired';
    await req.user.save();
    
    return res.status(403).json({ 
      message: 'Your membership has expired. Please renew to continue.' 
    });
  }
  
  next();
};