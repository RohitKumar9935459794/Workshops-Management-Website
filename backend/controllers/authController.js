const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  const { username, email, password, usertype } = req.body;

  if (!username || !email || !password || !usertype) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    console.log("calling fun");
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPassword, usertype);

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic field validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, usertype: user.user_type }, // match DB column
      process.env.TOKEN_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        usertype: user.user_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Protected route example
exports.protected = (req, res) => {
  res.status(200).json({
    msg: "This is a protected route",
    user: req.user, // set in middleware
  });
};