// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { findUserByEmail, createUser } = require("../models/userModel");
// const dotenv = require("dotenv");
// dotenv.config();
// const { getUserTypeByEmail } = require("../models/userModel");
// const findUserByEmail_R = require("../config/findUserByEmail");

// // exports.register = async (req, res) => {
// //   const { username, email, password, usertype } = req.body;

// //   if (!username || !email || !password || !usertype) {
// //     return res.status(400).json({ msg: "Please fill all fields" });
// //   }

// //   try {
// //     console.log("calling fun");
// //     const existingUser = await findUserByEmail(email);
// //     if (existingUser) {
// //       return res.status(400).json({ msg: "User already exists" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     await createUser(username, email, hashedPassword, usertype);

// //     res.status(201).json({ msg: "User registered successfully" });
// //   } catch (error) {
// //     console.error("Registration error:", error);
// //     res.status(500).json({ msg: "Server error during registration" });
// //   }
// // };

// // check user type 


// exports.getUserType = (req, res) => {
//   const email = req.params.email;

//   getUserTypeByEmail(email, (err, authType) => {
//     if (err) return res.status(500).json({ msg: "Server error", error: err });
//     if (!authType) return res.status(404).json({ msg: "User not found" });

//     res.status(200).json({ email, authType });
//   });
// };


// exports.register = (req, res) => {
//   const { name, email, password, authType = "user" } = req.body; // default to 'user'

//   findUserByEmail(email, (err, user) => {
//     if (user) return res.status(400).json({ msg: "User already exists" });

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) throw err;

//       createUser(name, email, hashedPassword, authType, (err, result) => {
//         if (err) throw err;
//         res.status(201).json({ msg: "User registered successfully" });
//       });
//     });
//   });
// };

// // exports.login = async (req, res) => {
// //   const { email, password } = req.body;

// //   // Basic field validation
// //   if (!email || !password) {
// //     return res.status(400).json({ msg: "Email and password are required" });
// //   }

// //   try {
// //     const user = await findUserByEmail(email);

// //     if (!user) {
// //       return res.status(401).json({ msg: "Invalid email or password" });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(401).json({ msg: "Invalid email or password" });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       { email: user.email, usertype: user.user_type }, // match DB column
// //       process.env.TOKEN_KEY,
// //       { expiresIn: "1d" }
// //     );

// //     res.status(200).json({
// //       msg: "Login successful",
// //       token,
// //       user: {
// //         username: user.username,
// //         email: user.email,
// //         usertype: user.user_type,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.status(500).json({ msg: "Server error during login" });
// //   }
// // };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ msg: "Email and password are required" });

//   try {
//     const user = await findUserByEmail_R(email);
//     if (!user) return res.status(401).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

//     // ✅ JWT Payload
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         usertype: user.user_type,
//       },
//       process.env.TOKEN_KEY,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       msg: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         usertype: user.user_type,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ msg: "Server error during login" });
//   }
// };



// // Protected route example
// exports.protected = (req, res) => {
//   res.status(200).json({
//     msg: "This is a protected route",
//     user: req.user, // set in middleware
//   });
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const db = require("../config/db");
const findUserByEmail = require("../config/findUserByEmail");

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password, usertype = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, auth_type) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, usertype]
    );

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email and password are required" });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.user_type,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
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

// PROTECTED ROUTE
exports.protected = (req, res) => {
  res.status(200).json({
    msg: "This is a protected route",
    user: req.user,
  });
};
