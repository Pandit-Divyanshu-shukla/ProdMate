const express = require("express");
const router = express.Router();

const { getAIInsights } = require("../controllers/aiInsightsController");
const authMiddleware = require("../middlewares/authMiddleware");

// ----------------------------------
// GET AI INSIGHTS (Protected)
// ----------------------------------
router.get("/", authMiddleware, getAIInsights);

module.exports = router;
