const Routine = require("../models/Routine");
const Task = require("../models/Task");
const { getGeminiInsights } = require("../services/geminiService");

exports.getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch routines
    const routines = await Routine.find({ userId });

    const routinesWithTasks = [];

    for (const routine of routines) {
      const tasks = await Task.find({ routineId: routine._id });

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

    const prompt = `
You are a productivity coach.
Analyze the following user productivity data and give actionable insights.

DATA:
${JSON.stringify(routinesWithTasks, null, 2)}
`;

    const insights = await getGeminiInsights(prompt);

    res.json({
      message: "AI productivity insights generated",
      insights,
    });
  } catch (error) {
    console.error("AI INSIGHTS ERROR:", error.message);
    res.status(500).json({
      message: "Failed to generate AI insights",
    });
  }
};
