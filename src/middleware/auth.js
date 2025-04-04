const jwt = require('jsonwebtoken');
const config = require('../config');


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error('JWT Error:', err.message);
    }
  }
  next();
}


module.exports = { verifyToken };
