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
  summary: { type: String },
   embedding: {
    type: [Number], 
  } ,
  likes:{type: Number , default: 0},
  createdAt: { type: Date, default: Date.now }
});
const pendingChapterSchema = new mongoose.Schema({
  ...chapterSchema.obj, 
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
  ,
   type: { type: String, enum: ["new_chapter", "edit_chapter"], required: true }, // "new_chapter" or "edit_chapter"
  originalChapterIndex: { type: Number }
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
    default: [], 
},

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String, 
    contributions: [contributionSchema], 
    votes: { type: Number, default: 0 },
    comments: [commentSchema], 
    history: [
      {
        title: String,
        content: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ], 
  collaborationInstructions: { type: String, default: "" }, // ADD THIS LINE

  },
  
  { timestamps: true },
  

);

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
