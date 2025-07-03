import mongoose from "mongoose";    
const chapterSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  embedding: { type: [Number], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});


const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;