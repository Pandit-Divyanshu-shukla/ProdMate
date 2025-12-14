const mongoose = require("mongoose");

const RoutineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    startTime: {
      type: String, // Example: "07:00" or "07:00 AM"
      required: true,
    },

    endTime: {
      type: String, // Example: "08:00" or "08:00 PM"
      required: true,
    },

    category: {
      type: String,
      enum: ["morning", "college", "gym", "study", "personal"],
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completionPercentage: {
      type: Number, 
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Routine", RoutineSchema);
