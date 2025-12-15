const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    // Owner of the reminder
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional: reminder for a routine
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routine",
    },

    // Optional: reminder for a task
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    // When reminder should trigger
    reminderTime: {
      type: Date,
      required: true,
    },

    // Message to send
    message: {
      type: String,
      required: true,
    },

    // Prevent sending reminder multiple times
    isSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", ReminderSchema);
