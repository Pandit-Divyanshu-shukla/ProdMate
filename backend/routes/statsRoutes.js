const express = require("express");
const router = express.Router();

const { getStats } = require("../controllers/statsController");
const authMiddleware = require("../middlewares/authMiddleware");

// ----------------------------------
// GET PRODUCTIVITY STATS (Protected)
// ----------------------------------
router.get("/", authMiddleware, getStats);

module.exports = router;
