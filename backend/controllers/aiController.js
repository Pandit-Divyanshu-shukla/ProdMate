const Routine = require("../models/Routine");
const Task = require("../models/Task");
const { getGeminiInsights } = require("../services/geminiService");

exports.generateInsights = async (req, res) => {
  console.log("Hits");
  try {
    const userId = req.user.id;

    const routines = await Routine.find({ userId });

    const data = [];

    for (const routine of routines) {
      const tasks = await Task.find({ routineId: routine._id });

      data.push({
        routine: routine.title,
        completion: routine.completionPercentage,
        tasks: tasks.map(t => ({
          title: t.title,
          completed: t.isCompleted,
          priority: t.priority
        }))
      });
    }

    const prompt = `
You are an intelligent daily planning assistant for a productivity app.

GOAL:
Analyze today's routines and tasks and suggest how to execute them efficiently
within the day.

RULES:
- Respond ONLY in valid JSON
- No markdown, no explanations, no emojis
- Maximum 5 points per array
- Each point must be 8–12 words
- Focus only on TODAY’s routines and tasks
- Suggestions must be practical and time-aware
- Use simple, neutral, non-judgmental language
- Do not repeat information across points
- Base all suggestions strictly on provided data

FORMAT:
{
  "positive": string[],
  "issues": string[],
  "actions": string[]
}

DATA:
${JSON.stringify(data, null, 2)}
`;

    const raw = await getGeminiInsights(prompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: "Invalid AI response" });
    }

    res.json({ insights: parsed });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};
