const axios = require("axios");

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash", // fallback
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
      timeout: 15_000, // 15 sec
    }
  );
};

const getGeminiInsights = async (prompt) => {
  let lastError;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await callGemini(model, prompt);
        return (
          res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No insights generated"
        );
      } catch (err) {
        lastError = err;

        const code = err.response?.status;
        if (code !== 503) break; // non-retryable

        console.warn(
          `⚠️ ${model} overloaded (attempt ${attempt}). Retrying...`
        );
        await sleep(500 * attempt); // exponential backoff
      }
    }
  }

  console.error("❌ Gemini failed:", lastError.response?.data || lastError.message);
  throw new Error("AI service temporarily unavailable");
};

module.exports = { getGeminiInsights };
