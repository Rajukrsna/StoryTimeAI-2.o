import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js"; // ✅ Import MongoDB connection
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import storyRoutes from "./routes/storyRoutes.js"; // ✅ Import story routes
import aiRoute from "./routes/aiRoutes.js"; // ✅ Import AI suggestion route
import emailRoutes from "./routes/emailRoutes.js"; // ✅ Import email route 
import battleRoutes from "./routes/battle.js"; // ✅ Import battle routes
import BattleService from "./routes/battleService.js"; // ✅ Import battle service
dotenv.config();
const app = express();

connectDB();

app.use(express.json({ limit: '1mb' })); // or higher like '2mb'

app.use(
  cors({
    origin:  process.env.FRONTEND_URL, // Change to deployed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true, // If using cookies/auth tokens
  })
);

app.options('*', cors()); // Handle preflight

app.use("/api/ai-suggestions", aiRoute);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/email",emailRoutes);
app.use("/api/battles", battleRoutes); 
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
function startBattleStatusUpdater() {
  // Run immediately on startup
  BattleService.updateBattleStatuses();
  
  // Then run every 1 minute (60000ms)
  setInterval(() => {
    console.log('Updating battle statuses...');
    BattleService.updateBattleStatuses();
  }, 60000); // Check every minute
}

// ✅ Start Server
const PORT = process.env.PORT || 5010; // ✅ Use Railway's assigned port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
   startBattleStatusUpdater();
});
