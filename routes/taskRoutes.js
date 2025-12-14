const express = require("express");
const {
  addTask,
  getTasksByRoutine,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// JWT middleware to protect routes
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ----------------------------------
// ADD TASK TO A ROUTINE
// POST /tasks/add/:routineId
// ----------------------------------
router.post("/add/:routineId", authMiddleware, addTask);

// ----------------------------------
// GET ALL TASKS OF A ROUTINE
// GET /tasks/:routineId
// ----------------------------------
router.get("/:routineId", authMiddleware, getTasksByRoutine);

// ----------------------------------
// UPDATE TASK BY TASK ID
// PUT /tasks/update/:id
// ----------------------------------
router.put("/update/:id", authMiddleware, updateTask);

// ----------------------------------
// DELETE TASK BY TASK ID
// DELETE /tasks/delete/:id
// ----------------------------------
router.delete("/delete/:id", authMiddleware, deleteTask);

module.exports = router;
