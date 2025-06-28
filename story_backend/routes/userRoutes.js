import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"
const router = express.Router();
// Storage config
import { fileURLToPath } from "url";

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


router.post("/change-pic", upload.single("profilePicture"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // return public path
  res.json({
    message: "Upload successful",
    filePath: `/uploads/${req.file.filename}`,
  });
});


export default router;
