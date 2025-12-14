const express = require("express");
const {
  addRoutine,
  getRoutines,
  updateRoutine,
  deleteRoutine,
} = require("../controllers/routineController");

// This middleware ensures only logged-in users can access routines
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// -----------------------------
// ADD A NEW ROUTINE
// -----------------------------
router.post("/add", authMiddleware, addRoutine);

// -----------------------------
// GET ALL ROUTINES FOR LOGGED-IN USER
// -----------------------------
router.get("/", authMiddleware, getRoutines);

// -----------------------------
// UPDATE ROUTINE BY ID
// -----------------------------
router.put("/:id", authMiddleware, updateRoutine);

// -----------------------------
// DELETE ROUTINE BY ID
// -----------------------------
router.delete("/:id", authMiddleware, deleteRoutine);

module.exports = router;
