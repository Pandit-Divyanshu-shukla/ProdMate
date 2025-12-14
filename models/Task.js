const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    // Which user owns this task
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which routine this task belongs to
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routine",
      required: true,
    },

    // Task title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional task details
    description: {
      type: String,
      trim: true,
    },

    // Priority helps in productivity analysis later
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Task completion status
    isCompleted: {
      type: Boolean,
      default: false,
    },

    // Optional deadline (can be same day)
    deadline: {
      type: Date,
    },

    // Estimated duration in minutes
    duration: {
      type: Number, // e.g., 30, 60, 90
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
