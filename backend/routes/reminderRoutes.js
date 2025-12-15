const express = require("express");
const {
  createReminder,
  getMyReminders,
} = require("../controllers/reminderController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------
// CREATE REMINDER
// POST /reminders/add
// ----------------------------------
router.post("/add", authMiddleware, createReminder);

// ----------------------------------
// GET ALL REMINDERS OF LOGGED-IN USER
// GET /reminders/
// ----------------------------------
router.get("/", authMiddleware, getMyReminders);

module.exports = router;
