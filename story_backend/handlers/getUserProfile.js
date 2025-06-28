import connectDB from "../utils/connectDB.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  try {
    await connectDB();

    const authHeader = event.headers.Authorization || event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
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
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error fetching user profile", error: error.message }),
    };
  }
};
