const express = require("express");
const router = express.Router();
const { register, login, protected: protectedRoute } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/protected", verifyToken, protectedRoute);

module.exports = router;