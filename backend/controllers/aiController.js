const Routine = require("../models/Routine");
const Task = require("../models/Task");
const { getGeminiInsights } = require("../services/geminiService");

// ----------------------------------
// GET AI PRODUCTIVITY INSIGHTS
// ----------------------------------
exports.getProductivityInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Fetch user's routines
    const routines = await Routine.find({ userId });

    // 2️⃣ Fetch user's tasks
    const tasks = await Task.find({ userId });

    // 3️⃣ Prepare summary for AI
    let prompt = `Analyze the following daily routine and tasks.
Give productivity insights, improvement suggestions, and warnings if any.\n\n`;

    prompt += `Routines:\n`;
    routines.forEach((r) => {
      prompt += `- ${r.title} (${r.completionPercentage}% completed)\n`;
    });

    prompt += `\nTasks:\n`;
    tasks.forEach((t) => {
      prompt += `- ${t.title} (Completed: ${t.isCompleted})\n`;
    });

    // 4️⃣ Get AI response
    const insights = await getGeminiInsights(prompt);

    // 5️⃣ Send response
    res.json({
      message: "AI productivity insights generated",
      insights,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate AI insights",
      error: error.message,
    });
  }
};
