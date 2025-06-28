import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔹 Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ Authenticated User:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ JWT Verification Failed:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
