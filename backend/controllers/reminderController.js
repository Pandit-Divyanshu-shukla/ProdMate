const Reminder = require("../models/Reminder");

// ----------------------------------
// CREATE REMINDER
// ----------------------------------
exports.createReminder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { routineId, taskId, reminderTime, message } = req.body;

    // Basic validation
    if (!reminderTime || !message) {
      return res
        .status(400)
        .json({ message: "reminderTime and message are required" });
    }

    // Ensure reminder is linked to either routine OR task
    if (!routineId && !taskId) {
      return res
        .status(400)
        .json({ message: "Reminder must be linked to a routine or task" });
    }

    const reminder = await Reminder.create({
      userId,
      routineId,
      taskId,
      reminderTime,
      message,
    });

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ----------------------------------
// GET USER REMINDERS
// ----------------------------------
exports.getMyReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const reminders = await Reminder.find({ userId }).sort({
      reminderTime: 1,
    });

    res.json({
      message: "Reminders fetched",
      reminders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
