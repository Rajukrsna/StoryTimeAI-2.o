import express from "express";
import { generateAISuggestion } from "../utils/aiHelper.js";
import { summarizeContent } from "../utils/aiHelper.js";
import Chapter from "../models/Chapter.js"; // Assuming you have a Chapter model  
// Assuming you have a function to summarize content 
const router = express.Router();
const { GEMINI_API_KEY } = process.env; // Ensure you have your API key set in environment variables  
/** ✅ AI Suggestion Route (Supports Genre) */
router.post("/", async (req, res) => {
  try {
    const {title, content} = req.body; // Default empty string if no story text

    if (!title && !content) {
      return res
        .status(400)
        .json({ message: "Provide either story text or genre." });
    }

    const suggestion = await generateAISuggestion(title, content);
    const summary = await summarizeContent(suggestion);
        console.log(" ✅ AI suggestion:", suggestion);

    console.log(" ✅ AI summary:", summary);
    res.json({ suggestion , summary });
  } 
  catch (error) 
    {
      console.error("❌ AI Suggestion Error:", error);
      res.status(500).json({ message: "AI Suggestion failed." });
    }
});

router.post("/plot-bot", async (req, res) => {
  try {
    const { prompt, embed } = req.body;

    if (!prompt || !embed) {
      return res.status(400).json({ message: "Missing prompt or embedding." });
    }

    // ✅ Step 1: Vector Search in MongoDB
  const chapters = await Chapter.aggregate([
  {
    $vectorSearch: {
      index: "vectorSearchIndex", // ✔️ Vector index on Chapter collection
      path: "embedding",          // ✔️ embedding is directly on chapter
      queryVector: embed,
      numCandidates: 100,
      limit: 5,
    }
  },
  {
    $project: {
      chapterTitle: "$title",
      storyId: 1,
      summary: 1,
    }
  },
  {
    $lookup: {
      from: "stories",            // Link back to story title
      localField: "storyId",
      foreignField: "_id",
      as: "storyInfo"
    }
  },
  {
    $unwind: "$storyInfo"
  },
  {
    $project: {
      chapterTitle: 1,
      summary: 1,
      storyTitle: "$storyInfo.title"
    }
  }
]);


    console.log("🔍 Top matching chapters:", chapters.length);

    // ✅ Step 2: Build context for RAG
    const context = chapters.map(
  (ch, i) => `Chapter ${i + 1} - ${ch.chapterTitle} from "${ch.storyTitle}":\n${ch.summary}`
).join("\n\n");

    // ✅ Step 3: Ask AI Model (Gemini / OpenAI / Claude)
    const fullPrompt = `You are PlotBot, a story assistant. Based on the context below, answer the user's question.

Context:
${context}

User question:
"${prompt}"

Give a natural language helpful response.`;

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
                  parts: [{ text: fullPrompt }],
                },
              ],
            }),
          }
        );
    
        const data = await response.json();
    
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    

    return res.json({ response: generatedText.trim() });
  } catch (error) {
    console.error("❌ PlotBot Error:", error);
    return res.status(500).json({ message: "PlotBot failed." });
  }
});


export default router;
