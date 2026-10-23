const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Not logged in' });
    const { id } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

exports.ownerOnly = (req, res, next) =>
  ['owner', 'admin'].includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'Only owners can do this' });
