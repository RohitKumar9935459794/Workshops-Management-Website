// const express = require("express");
// const router = express.Router();
// const { register, login, protected: protectedRoute } = require("../controllers/authController");
// const verifyToken = require("../middlewares/authMiddleware");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/protected", verifyToken, protectedRoute);

// module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/protected", verifyToken, authController.protected);

module.exports = router;
