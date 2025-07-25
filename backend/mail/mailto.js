// server.js
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());

// configure connection pool
const pool = mysql.createPool({
  host: "localhost", user: "root", password: "root", database: "nielit"
});

const JWT_SECRET = "jwt_secret_key";

// Set up nodemailer transporter (for Gmail or use environment vars)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword"   // consider using env vars
  }
});

// FORGOT PASSWORD route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.json({ Status: "User not existed" });
    }
    const user = rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
    const resetLink = `http://localhost:5173/reset_password/${user.id}/${token}`;

    await transporter.sendMail({
      from: "youremail@gmail.com",
      to: user.email,
      subject: "Reset Password Link",
      text: resetLink
    });

    res.json({ Status: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: "Error", error: err.message });
  } finally {
    conn.release();
  }
});

// RESET PASSWORD route
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err || decoded.id != id) {
      return res.json({ Status: "Error with token" });
    }
    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
      await conn.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hash, id]
      );
      res.json({ Status: "Success" });
    } catch (err) {
      res.status(500).json({ Status: "Error", error: err.message });
    } finally {
      conn.release();
    }
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
