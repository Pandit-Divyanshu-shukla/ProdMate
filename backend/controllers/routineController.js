const Routine = require("../models/Routine");


// -------------------------------
// ADD NEW ROUTINE
// -------------------------------
exports.addRoutine = async (req, res) => {
  try {
    // Get logged-in user's ID from JWT (added by authMiddleware)
    const userId = req.user.id;

    // Extract routine details from request body
    const { title, description, startTime, endTime, category } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create new routine entry in database
    const routine = await Routine.create({
      userId,
      title,
      description,
      startTime,
      endTime,
      category,
    });

    // Send response back to client
    res.status(201).json({
      message: "Routine created successfully",
      routine,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// -------------------------------
// GET ALL ROUTINES FOR LOGGED-IN USER
// -------------------------------
exports.getRoutines = async (req, res) => {
  try {
    // Get the logged-in user's ID
    const userId = req.user.id;

    // Find all routines created by this user
    // Sort by start time for better display
    const routines = await Routine.find({ userId }).sort({ startTime: 1 });

    res.json({
      message: "Routines fetched",
      routines,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// -------------------------------
// UPDATE ROUTINE BY ID
// -------------------------------
exports.updateRoutine = async (req, res) => {
  try {
    const routineId = req.params.id; // Routine ID from URL

    // Find routine by ID and update with new data
    const updated = await Routine.findByIdAndUpdate(
      routineId,
      req.body,     // fields to update
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.json({
      message: "Routine updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// -------------------------------
// DELETE ROUTINE BY ID
// -------------------------------
exports.deleteRoutine = async (req, res) => {
  try {
    const routineId = req.params.id;

    // Find routine by ID and delete
    const deleted = await Routine.findByIdAndDelete(routineId);

    if (!deleted) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.json({
      message: "Routine deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
