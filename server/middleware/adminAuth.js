const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token failed validation' });
  }
};

module.exports = protectAdmin; // Export directly as a function