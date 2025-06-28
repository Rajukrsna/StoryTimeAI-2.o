import mongoose from "mongoose";

// ✅ Contribution Schema
const contributionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true, minlength: 10 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes:{type: Number , default: 0},
  createdAt: { type: Date, default: Date.now }
});
const pendingChapterSchema = new mongoose.Schema({
  ...chapterSchema.obj, // Spread existing fields
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

// ✅ Comment Schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Story Schema
const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    content: [chapterSchema],
   pendingChapters: {
   type: [pendingChapterSchema],
  default: [], // optional but recommended
},

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String, // ✅ Image upload feature  (optional)
    contributions: [contributionSchema], // ✅ Contribution feature
    votes: { type: Number, default: 0 }, // ✅ Voting feature
    comments: [commentSchema], // ✅ Commenting feature
    history: [
      {
        title: String,
        content: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ], // ✅ Version control
  },
  { timestamps: true }
);

// ✅ Middleware: Track story history on updates
storySchema.pre("save", function (next) {
  if (this.isModified("title") || this.isModified("content")) {
    this.history.push({
      title: this.title,
      content: this.content,
      updatedAt: new Date(),
    });
  }
  next();
});

const Story = mongoose.model("Story", storySchema);
export default Story;
