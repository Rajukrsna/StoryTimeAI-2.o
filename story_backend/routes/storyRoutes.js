import express from "express";
import mongoose from "mongoose";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { protect } from "../utils/authMiddleware.js";
import Chapter from "../models/Chapter.js"; // Import Chapter model

const router = express.Router();

router.delete("/stories/:id", async (req, res) => {
  const { id } = req.params;

  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Story ID format" });
  }

  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    await story.deleteOne();
    return res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting story", error: error.message });
  }
});


router.get('/getUserStories',protect,async (req, res) => {
  try {
   // console.log("Fetching user stories  fucker sezer:", req.user._id);
    //console.log("User ID:", req.user._id);
    // ✅ Find stories authored by the user
    const stories = await Story.find({ author: req.user._id }).populate('author', 'name');

    return res.status(200).json(stories);
  } catch (error) {
    console.error('Error getting user stories:', error);
    return res.status(500).json({ message: 'Error getting user stories', error: error.message });
  }
});

router.get("/stories",protect, async (req, res) => {
  try {
   // console.log("enterd getAllStories route");
    const { search, sort } = req.query;
    let filter = {};

    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: { $regex: safeSearch, $options: "i" } }];
    }

    let query = Story.find(filter).populate("author", "name profilePicture");

    if (sort === "latest") query.sort({ createdAt: -1 });
    else if (sort === "oldest") query.sort({ createdAt: 1 });
    else if (sort === "top") query.sort({ votes: -1 });

    const stories = await query.lean();

    res.status(200).json(stories);
  } catch (error) {
  
    res.status(500).json({ message: "Error fetching stories", error: error.message });
  }
});

// /** ✅ Create a New Story (Protected) */
router.post("/", protect, async (req, res) => {
  try {

    const { title, chapters, summary, imageUrl, embeds ,collaborationInstructions } = req.body;
  //  console.log("summary", summary);
   // console.log("chapters", chapters);

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
      content: Chapters,
      collaborationInstructions
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
    const story = await Story.findById(id).populate("author", "name email");//populate author with name and email

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
    //console.log("Populated Leaderboard:", populatedLeaderboard);
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

// NEW: Endpoint for updating story votes
router.post("/:id/vote", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // Expecting vote: 1 for upvote, -1 for downvote

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Update votes atomically
    story.votes += vote;
    await story.save();

    res.status(200).json({ message: "Vote updated successfully", votes: story.votes });
  } catch (error) {
    console.error("Error updating story vote:", error);
    res.status(500).json({ message: "Error updating story vote", error: error.message });
  }
});

// NEW: Endpoint for updating chapter likes
router.post("/:storyId/chapter/:chapterIndex/like", protect, async (req, res) => {
  try {
    const { storyId, chapterIndex } = req.params;
    const { liked } = req.body; // Expecting liked: true for like, false for unlike

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const index = parseInt(chapterIndex, 10);
    if (isNaN(index) || index < 0 || index >= story.content.length) {
      return res.status(400).json({ message: "Invalid chapter index" });
    }

    const chapter = story.content[index];
    if (liked) {
      chapter.likes += 1;
    } else {
      chapter.likes -= 1;
    }

    await story.save(); // Save the parent story to persist chapter changes

    res.status(200).json({ message: "Chapter likes updated successfully", likes: chapter.likes });
  } catch (error) {
    console.error("Error updating chapter likes:", error);
    res.status(500).json({ message: "Error updating chapter likes", error: error.message });
  }
});



router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    // Destructure all possible payload fields
    const { content, newChapter, editedChapterData, editedChapterIndex } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Story ID format" });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    //console.log("content of the storyh", content);
    const isAuthor = story.author.toString() === req.user._id.toString();

    // Scenario 1: Author is updating the entire story content (e.g., after editing a chapter)
    // This is triggered when `content` (the full array) is sent and no `newChapter` or `editedChapterData` is present.
    if (isAuthor && content && !newChapter && !editedChapterData) {
      //console.log("Author updating entire story content");
      story.content = content; // Replace the entire content array
      const updatedStory = await story.save();
      return res.status(200).json(updatedStory);
    }

    // Scenario 2: Adding a new chapter (either author or non-author)
    if (newChapter) {
      if (isAuthor) {
        story.content.push(newChapter);
        await story.save();
        // Also save the new chapter to the Chapter collection
        const chapterToSave = new Chapter({
          ...newChapter,
          storyId: story._id,
          embedding: newChapter.embedding || [], // Ensure embedding is included
        });
        await chapterToSave.save();
        return res.status(200).json(story);
      } else {
        // Non-author adding a new chapter, add to pending
        story.pendingChapters = story.pendingChapters || [];
        story.pendingChapters.push({
          ...newChapter,
          requestedBy: req.user._id,
          status: "pending",
          type: "new_chapter", // Explicitly mark as new chapter
        });
        await story.save();
        return res.status(202).json({ message: "Chapter request sent to author for approval." });
      }
    }

    // Scenario 3: Non-author proposing an edit to an existing chapter
    // This is triggered when `editedChapterData` and `editedChapterIndex` are sent.
    if (!isAuthor && editedChapterData && editedChapterIndex !== undefined) {
      // Validate editedChapterData structure if necessary
      if (typeof editedChapterIndex !== 'number' || editedChapterIndex < 0) {
        return res.status(400).json({ message: "Invalid editedChapterIndex." });
      }
      if (!editedChapterData.content || !editedChapterData.title) { // Basic validation
        return res.status(400).json({ message: "Edited chapter data is incomplete." });
      }

      story.pendingChapters = story.pendingChapters || [];
      story.pendingChapters.push({
        ...editedChapterData, // This is the single chapter object
        originalChapterIndex: editedChapterIndex, // Store the index of the chapter being edited
        requestedBy: req.user._id,
        status: "pending",
        type: "edit_chapter", // Explicitly mark as an edit request
      });
      await story.save();
      return res.status(202).json({ message: "Edit request sent for approval." });
    }

    // If none of the above scenarios match, it's an invalid request
    return res.status(400).json({ message: "Invalid update request. Missing content, newChapter, or editedChapterData." });

  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Error updating story", error: error.message });
  }
});



router.post("/:id/approve-chapter/:chapterIndex", protect, async (req, res) => {
  try {
    //console.log("entered teh chapter approval route");
    const { id, chapterIndex } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Ensure the current user is the author of the story
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to approve chapters for this story." });
    }

    const chapterToApprove = story.pendingChapters[chapterIndex];
    //console.log("chapterToApprove", chapterToApprove);
    if (!chapterToApprove) return res.status(404).json({ message: "Pending chapter not found." });

    // Create a clean chapter object to add to story.content
    const approvedChapterContent = {
      title: chapterToApprove.title,
      content: chapterToApprove.content,
      summary: chapterToApprove.summary,
      likes: chapterToApprove.likes,
      embedding: chapterToApprove.embedding ||[], // Ensure embedding is included
      createdBy: chapterToApprove.createdBy, // The user who submitted the pending chapter
      createdAt: chapterToApprove.createdAt,
    };
    if (chapterToApprove.type === "new_chapter") {
      story.content.push(approvedChapterContent);
      //also add the chapter to the Chapter collection
      const newChapter = new Chapter({
        ...approvedChapterContent,
        storyId: story._id,
        embedding: chapterToApprove.embedding || [], // Ensure embedding is included
      });
      await newChapter.save();
    } else if (chapterToApprove.type === "edit_chapter") {
      const originalIndex = chapterToApprove.originalChapterIndex;
      if (originalIndex === undefined || originalIndex < 0 || originalIndex >= story.content.length) {
        return res.status(400).json({ message: "Invalid original chapter index for edit approval." });
      }
      // Replace the existing chapter at the specified index
      story.content[originalIndex] = approvedChapterContent;
    } else {
      return res.status(400).json({ message: "Unknown pending chapter type." });
    }

    // Remove the approved chapter from pendingChapters
    story.pendingChapters.splice(chapterIndex, 1);

    // Update the contributor's score (if applicable)
    const contributor = await User.findById(chapterToApprove.createdBy);
    if (contributor) {
      const contributionTitle = story.title; // Or chapterToApprove.title
      const existingContributionIndex = contributor.contributions.findIndex(
        (c) => c.title === contributionTitle
      );

      if (existingContributionIndex > -1) {
        contributor.contributions[existingContributionIndex].score += 1; // Increment score
      } else {
        contributor.contributions.push({ title: contributionTitle, score: 1 }); // Add new contribution
      }
      await contributor.save();
    }

    await story.save();
    res.status(200).json({ message: "Chapter approved and added to story." });
  } catch (error) {
    console.error("Error approving chapter:", error);
    res.status(500).json({ message: "Error approving chapter", error: error.message });
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
