import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"
import {protect}from "../utils/authMiddleware.js";
const router = express.Router();
import Story from "../models/Story.js"; 
// Storage config
import { fileURLToPath } from "url";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// manually recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendUploadsPath = path.join(__dirname, "../../StoryTime-Frontend/public/uploads");

// Ensure the directory exists
if (!fs.existsSync(frontendUploadsPath)) {
  fs.mkdirSync(frontendUploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, frontendUploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/all", async (req, res) => {
  try {
  

    const authors = await User.find({}, "name bio profilePicture");

    const formattedAuthors = authors.map((author) => ({
      _id: author._id,
      name: author.name,
      bio: author.bio || "",
      profilePicture: author.profilePicture || "/default.jpg", // fallback image
    }));

    res.status(200).json(formattedAuthors);
  } catch (error) {
    console.error("Error in /all route:", error);
    res.status(500).json({
      message: "Error fetching user profile",
      error: error.message,
    });
  }
});

router.post("/change-pic", upload.single("profilePicture"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "Upload successful",
    filePath: `/uploads/${req.file.filename}`,
  });
});

router.get("/my-chapters",protect, async (req, res) =>
{
  console.log("Entered")
   const userId = req.user._id; 
   console.log("Fetching chapters for user:", userId);
    try {
      const stories = await Story.find({
        $or: [
          { "content.createdBy": userId },
          { "pendingChapters.requestedBy": userId },
        ]
      }).populate("author").populate("content.createdBy").populate("pendingChapters.requestedBy");
  
      const chapterStatuses = [];
  
      stories.forEach((story) => {
        // Approved Chapters
        story.content.forEach((chapter) => {
          if (chapter.createdBy._id.toString() === userId.toString()) {
            chapterStatuses.push({
              storyTitle: story.title,
              chapterTitle: chapter.title,
              status: "approved",
              createdAt: chapter.createdAt,
            });
          }
        });
  
        // Pending Chapters
        story.pendingChapters.forEach((chapter) => {
          if (chapter.requestedBy._id.toString() === userId.toString()) {
            chapterStatuses.push({
              storyTitle: story.title,
              chapterTitle: chapter.title,
              status: chapter.status,
              createdAt: chapter.createdAt,
            });
          }
        });
      });
  console.log("Chapter statuses:", chapterStatuses);
  res.json({ chapters: chapterStatuses });
    } catch (err) {
      console.error("Error fetching user chapters:", err);
      res.status(500).json({ message: "Failed to get user chapter statuses." });
    }
  });

  router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    console.log("📥 Sign-up request received:", req.body);
    const { name, email, password, profilePicture } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

//const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: password,
      profilePicture: profilePicture, // Upload handled separately
    });

    await newUser.save();
    const token = generateToken(newUser._id);

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (err) {
    console.error("❌ Sign-up error:", err);
    return res.status(500).json({ message: "Error", error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log("📥 Login request received:", req.body);
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
console.log("Found user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Validate password
const isMatch = password === user.password;
console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = generateToken(user._id);
   console.log("Generated token:", token);
    // 🎉 Send response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
const token =
      req.cookies?.authToken ||
      req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Generate new token
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
// ✅ Send cookie back (optional)
    res.cookie('authToken', newToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // Set to true in production (HTTPS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({ token: newToken });
  } catch (err) {
    console.error("Token refresh error:", err.message);
    res.status(401).json({ message: "Token refresh failed" });
  }
});


export default router;
