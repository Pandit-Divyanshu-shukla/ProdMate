const express = require("express");
const { getProductivityInsights } = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------
// GET AI PRODUCTIVITY INSIGHTS
// Protected Route (JWT required)
// ----------------------------------
router.get("/insights", authMiddleware, getProductivityInsights);

module.exports = router;
