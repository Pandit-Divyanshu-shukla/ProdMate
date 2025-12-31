const Routine = require("../models/Routine");
const Task = require("../models/Task");

// ----------------------------------
// GET PRODUCTIVITY STATS
// ----------------------------------
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total routines
    const totalRoutines = await Routine.countDocuments({ userId });

    // Total tasks
    const totalTasks = await Task.countDocuments({ userId });

    // Completed tasks
    const completedTasks = await Task.countDocuments({
      userId,
      isCompleted: true,
    });

    // Overall completion %
    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    // Today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tasks completed today
    const tasksCompletedToday = await Task.countDocuments({
      userId,
      isCompleted: true,
      updatedAt: { $gte: today },
    });

    res.json({
      message: "Productivity stats fetched",
      stats: {
        totalRoutines,
        totalTasks,
        completedTasks,
        completionPercentage,
        tasksCompletedToday,
      },
    });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
