import express from "express";
import { generateAISuggestion } from "../utils/aiHelper.js";

const router = express.Router();

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
    console.log("✅ AI Suggestion:", suggestion);
    res.json({ suggestion });
  } catch (error) {
    console.error("❌ AI Suggestion Error:", error);
    res.status(500).json({ message: "AI Suggestion failed." });
  }
});

export default router;
