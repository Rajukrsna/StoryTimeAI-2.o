import Story from "../models/Story.js";
import connectDB from "../utils/connectDB.js";
import mongoose from "mongoose";

export const handler = async (event) => {
  try {
    await connectDB();
    const { id } = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid Story ID format" }),
      };
    }

    const story = await Story.findById(id);
    if (!story) {
      return {
        statusCode: 404,headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "Story not found" }),
      };
    }

    await story.deleteOne();
    return {
      statusCode: 200,headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Story deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error deleting story", error: error.message }),
    };
  }
};