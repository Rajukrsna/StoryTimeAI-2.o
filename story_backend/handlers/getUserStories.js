import Story from "../models/Story.js";
import connectDB from "../utils/connectDB.js";
import  User from "../models/User.js"; // Ensure User model is imported to populate author field   
import jwt from "jsonwebtoken";
export const handler = async (event) => {
  try {
    await connectDB();
    
    const authHeader = event.headers.Authorization || event.headers.authorization;

    if (!authHeader || !authHeader.startsWith(" Bearer ")) {
      return {
        statusCode: 401,
        headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "Not authorized, no token" }),
      };
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user by ID from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return {
        statusCode: 404,
        headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    const stories = await Story.find({ author: user._id }).populate("author", "name");

    return {
      statusCode: 200,
       headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
       },
      body: JSON.stringify(stories),
  }
 } catch (error) {
    console.error("Error getting user stories:", error);
    return {
      statusCode: 500,
       headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error getting user stories", error: error.message }),
    };
  }
};
