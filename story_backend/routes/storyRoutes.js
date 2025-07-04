import express from "express";
import mongoose from "mongoose";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { protect } from "../utils/authMiddleware.js";
import Chapter from "../models/Chapter.js"; // Import Chapter model

const router = express.Router();



router.get('/getUserStories',protect,async (req, res) => {
  try {
    console.log("Fetching user stories  fucker sezer:", req.user._id);
    console.log("User ID:", req.user._id);
    // ✅ Find stories authored by the user
    const stories = await Story.find({ author: req.user._id }).populate('author', 'name');

    return res.status(200).json(stories);
  } catch (error) {
    console.error('Error getting user stories:', error);
    return res.status(500).json({ message: 'Error getting user stories', error: error.message });
  }
});
// /** ✅ Create a New Story (Protected) */
router.post("/", protect, async (req, res) => {
  try {

    const { title, chapters, summary, imageUrl, embeds } = req.body;
    console.log("summary", summary);
    console.log("chapters", chapters);

    if (!title || !chapters) {
      return res.status(400).json({ message: "Title and chapters are required" });
    }
 // Step 2: Save chapters to Chapter collection with reference to this story
    const Chapters = chapters.map((ch, index) => ({
      title: ch.title || `Chapter ${index + 1}`,
      content: ch.content,
      createdBy: req.user._id,     // 🔗 Reference to Story
      summary: summary,
      embedding: embeds || [],  // Ensure per-chapter embedding
      createdAt: new Date(),
    }));
    // Step 1: Create and save story metadata (without embedding chapters inside)
    const story = new Story({
      title,
      author: req.user._id,
      imageUrl: imageUrl ,
      content: Chapters
    });

    const savedStory = await story.save();

    // Step 2: Save chapters to Chapter collection with reference to this story
    const enrichedChapters = chapters.map((ch, index) => ({
      title: ch.title || `Chapter ${index + 1}`,
      content: ch.content,
      createdBy: req.user._id,
      storyId: savedStory._id,       // 🔗 Reference to Story
      summary: summary,
      embedding: embeds || [],  // Ensure per-chapter embedding
      createdAt: new Date(),
    }));

    // Insert multiple chapters
    const savedChapters = await Chapter.create(enrichedChapters);

    res.status(201).json({
      story: savedStory,
      chapters: savedChapters,
    });
  } catch (error) {
    console.error("❌ Error creating story:", error);
    res.status(500).json({
      message: "Error creating story",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Story ID format" });
  }

  try {
    const story = await Story.findById(id).populate("author", "name");

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const populatedContent = await Promise.all(
      story.content.map(async (chapter) => {
        const user = await User.findById(chapter.createdBy).select("name profilePicture");
        return {
          ...chapter.toObject(),
          createdBy: user,
        };
      })
    );

    story.content = populatedContent;

    return res.status(200).json(story);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching story", error: error.message });
  }
});


/** ✅ Leaderboard API */
router.get("/leaderboard/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const leaderboard = await User.aggregate([
      { $unwind: "$contributions" },
      { $match: { "contributions.title": title } },
      {
        $group: {
          _id: "$_id", 
          totalScore: { $sum: "$contributions.score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);

    const populatedLeaderboard = await User.populate(leaderboard, {
      path: "_id",
      select: "name profilePicture",
    });
    console.log("Populated Leaderboard:", populatedLeaderboard);
    res.json(
      populatedLeaderboard.map((entry) => ({
        userId: entry._id._id,
        name: entry._id.name,
        profilePicture: entry._id.profilePicture,
        totalScore: entry.totalScore,
      }))
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
});

// /**  Update a Story (Protected) */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { votes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }
    if ( !content) {
      return res
        .status(400)
        .json({ message: "Title or content required for update" });
    }
    const story = await Story.findById(id);    
    if (!story) return res.status(404).json({ message: "Story not found" });
      if (story.author.toString() !== req.user._id.toString()) {
    // Not author - add to pending requests
    const  newChapter = req.body.newChapter;
    console.log("these are the field of the new chapters", newChapter)
    if (!newChapter) {
      return res.status(400).json({ message: "Chapter data missing" });
    }
      story.pendingChapters = story.pendingChapters || [];
      story.pendingChapters.push({
      ...newChapter,
      requestedBy: req.user._id,
      status: "pending",
    });
     story.votes= votes||story.votes;
    await story.save();
    return res.status(202).json({ message: "Chapter request sent to author for approval." });
  }
else{
    story.votes= votes||story.votes;
    story.content = content || story.content;
    const updatedStory = await story.save();
    res.json(updatedStory);
}
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
  }
});


router.put("/:id/approve-chapter/:chapterIndex", protect, async (req, res) => {
  try {
    const { id, chapterIndex } = req.params;
    //console.log(id, chapterIndex);
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Check if current user is the story author
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the author can approve chapters." });
    }

    const index = parseInt(chapterIndex, 10);
    const pendingChapter = story.pendingChapters[index];
    if (!pendingChapter) {
      return res.status(404).json({ message: "Pending chapter not found" });
    }
    const user = await User.findById(pendingChapter.requestedBy)
  const contributions= [
        {
          title: story.title || "N/A",
          score: 1,
        }];
            console.log("contri user", user)
   if (Array.isArray(contributions)) {
     contributions.forEach((c) => {
        if (c.title && typeof c.score === 'number') {
          user.contributions.push(c);
        }
      });
    }

     await user.save();

    // ✅ Destructure only allowed fields for content
    const { title, content, createdBy, createdAt, likes , embedding, summary} = pendingChapter;

    // ✅ Push clean version to main content
    story.content.push({
      title,
      content,
      createdBy,
      createdAt,
      summary,
      embedding,
      likes
    });

       // ✅ Insert into Chapter collection
await Chapter.create({
  title,
  content,
  createdBy,
  createdAt,
  likes,
  storyId: story._id,     // Reference to the main story
  summary: pendingChapter.summary || "", // Optional if you store it
  embedding: pendingChapter.embedding || [],
});


    // ✅ Remove from pendingChapters
    story.pendingChapters.splice(index, 1);

    // ✅ Save story
    await story.save();

    res.status(200).json({ message: "Chapter approved and added to story", story });

  } catch (error) {
    console.error("Error approving chapter:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
// ✅ In your Express router (e.g., storyRoutes.js)
router.delete("/:id/reject-chapter/:chapterIndex", protect, async (req, res) => {
  try {
    const { id, chapterIndex } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Ensure only the author can reject
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the author can reject chapters." });
    }

    const index = parseInt(chapterIndex, 10);
    if (isNaN(index) || index < 0 || index >= story.pendingChapters.length) {
      return res.status(400).json({ message: "Invalid chapter index" });
    }

    // Remove the pending chapter
    story.pendingChapters.splice(index, 1);

    await story.save();

    res.status(200).json({ message: "Chapter rejected and removed from pending list", story });
  } catch (error) {
    console.error("Error rejecting chapter:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



 export default router;
