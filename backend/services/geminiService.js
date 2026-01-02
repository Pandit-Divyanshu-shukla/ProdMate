const axios = require("axios");

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const callGemini = async (model, prompt) => {
  return axios.post(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      params: { key: process.env.GEMINI_API_KEY },
      headers: { "Content-Type": "application/json" },
      timeout: 15_000,
    }
  );
};

// ✅ fallback used when quota is exceeded
const fallbackInsights = JSON.stringify({
  positive: [
    "One routine completed successfully, showing consistency today",
  ],
  issues: [
    "Some routines remain incomplete for the day",
  ],
  actions: [
    "Focus on completing one pending routine next",
  ],
});

const getGeminiInsights = async (prompt) => {
  let lastError;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await callGemini(model, prompt);

        return (
          res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          fallbackInsights
        );
      } catch (err) {
        lastError = err;

        const status = err.response?.status;
        const reason = err.response?.data?.error?.status;

        // ❌ QUOTA EXCEEDED → DO NOT RETRY
        if (status === 429 || reason === "RESOURCE_EXHAUSTED") {
          console.warn("⚠️ Gemini quota exceeded. Using fallback insights.");
          return fallbackInsights;
        }

        // ⏳ TEMPORARY OVERLOAD → RETRY
        if (status === 503) {
          console.warn(
            `⚠️ ${model} overloaded (attempt ${attempt}). Retrying...`
          );
          await sleep(500 * attempt);
          continue;
        }

        // ❌ OTHER ERRORS → BREAK
        break;
      }
    }
  }

  console.error(
    "❌ Gemini failed:",
    lastError?.response?.data || lastError?.message
  );

  return fallbackInsights;
};

module.exports = { getGeminiInsights };
