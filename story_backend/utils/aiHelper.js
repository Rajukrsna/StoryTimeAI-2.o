import fetch from "node-fetch";
import {  GEMINI_API_KEY } from "../config/config.js";

/** 🔹 Generate AI Suggestions for a Story with Genre */
export const generateAISuggestion = async (title, content) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error("❌ Missing Gemini API Key! Ensure GEMINI_API_KEY is set in .env");
      return "AI suggestion service unavailable.";
    }

    console.log(`🟢 Requesting AI Suggestion using Gemini for title: ${title}`);

    const prompt = `Continue this story for the title: "${title}".

Story so far:
"${content}"

Guidelines:
- Maintain a thrilling tone and atmosphere.
- Expand with rich descriptions and vivid details.
- Develop character emotions and realistic interactions.
- Introduce an engaging plot twist or unexpected event.
- Keep the writing style natural and immersive.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      console.log("✅ AI Suggestion Generated Successfully");
      return generatedText.trim();
    } else {
      console.error("❌ No response from Gemini:", data);
      return "No AI suggestion available.";
    }
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message || error);
    return "AI suggestion failed.";
  }
};


export const summarizeContent = async (chapterText) => {
  if (!GEMINI_API_KEY) {
    console.error("❌ Missing Gemini API Key!");
    return "Summary service unavailable.";
  }

  const prompt = `Summarize the following story in 2-3 sentences:

"${chapterText}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return summary?.trim() || "No summary generated.";
  } catch (error) {
    console.error("❌ Summary generation error:", error.message || error);
    return "Summary generation failed.";
  }
};
