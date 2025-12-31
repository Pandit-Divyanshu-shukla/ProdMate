const Routine = require("../models/Routine");
const Task = require("../models/Task");

// ----------------------------------
// PREPARE DATA FOR AI INSIGHTS
// ----------------------------------
exports.getAIData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch routines
    const routines = await Routine.find({ userId });

    // Attach tasks to each routine
    const routinesWithTasks = [];

    for (const routine of routines) {
      const tasks = await Task.find({
        routineId: routine._id,
      });

      routinesWithTasks.push({
        title: routine.title,
        completionPercentage: routine.completionPercentage,
        isCompleted: routine.isCompleted,
        tasks: tasks.map((task) => ({
          title: task.title,
          isCompleted: task.isCompleted,
          priority: task.priority,
        })),
      });
    }

    res.json({
      message: "AI data prepared",
      data: routinesWithTasks,
    });
  } catch (error) {
    console.error("AI DATA ERROR:", error);
    res.status(500).json({
      message: "Failed to prepare AI data",
    });
  }
};
