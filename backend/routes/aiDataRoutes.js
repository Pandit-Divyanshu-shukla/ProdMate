const express = require("express");
const router = express.Router();

const { getAIData } = require("../controllers/aiDataController");
const authMiddleware = require("../middlewares/authMiddleware");

// ----------------------------------
// GET DATA FOR AI INSIGHTS (Protected)
// ----------------------------------
router.get("/", authMiddleware, getAIData);

module.exports = router;
