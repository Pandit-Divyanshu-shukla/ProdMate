const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// REGISTER ROUTE
router.post("/register", register);

// LOGIN ROUTE
router.post("/login", login);

// PROTECTED ROUTE
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user.id
  });
});

module.exports = router;
