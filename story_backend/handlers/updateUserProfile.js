import connectDB from "../utils/connectDB.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  try {
    await connectDB();

    // ✅ Parse headers and body
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({ message: "Not authorized, no token" }),
      };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // ✅ Parse and update fields from request body
    const data = JSON.parse(event.body || "{}");

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.bio = data.bio || user.bio;
    user.profilePicture = data.profilePicture || user.profilePicture;
    if (data.password) {
      user.password = data.password;
    }

    const updatedUser = await user.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        token,
      }),
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ message: "Error updating profile", error: error.message }),
    };
  }
};
