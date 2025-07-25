// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(403).json({ msg: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// module.exports = verifyToken;


// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(403).json({ msg: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, 'process.env.TOKEN_KEY', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
