import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    suggestion: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 }, // Rating 1-5
    comment: { type: String }, // Optional user comment
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
