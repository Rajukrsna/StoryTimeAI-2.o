import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js"; // ✅ Import MongoDB connection
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import storyRoutes from "./routes/storyRoutes.js"; // ✅ Import story routes
import aiRoute from "./routes/aiRoutes.js"; // ✅ Import AI suggestion route

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (Fixes frontend issues)
app.use(
  cors({
    origin: process.env.FRONTEND_URL , // Change to deployed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true, // If using cookies/auth tokens
  })
);

app.options('*', cors()); // Handle preflight

app.use("/api/ai-suggestions", aiRoute);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

// ✅ Logout Route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5010; // ✅ Use Railway's assigned port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
