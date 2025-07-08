const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

const SECRET_KEY = 'secret123';

/**
 * LOGIN API
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

/**
 * ADMIN (or user) REGISTRATION API
 */
router.post('/register', (req, res) => {
    const { username, password, user_type } = req.body;

    if (!username || !password || !user_type) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Insert new admin/user
        const insertQuery = 'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, password, user_type], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database insert error' });

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

/**
 * PROTECTED TEST API
 */
router.get('/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalid' });
        res.json({ message: `Hello ${user.username}`});
    });
});

module.exports = router;