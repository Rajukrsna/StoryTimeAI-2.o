import Story from "../models/Story.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import connectDB from "../utils/connectDB.js";

export const handler = async (event) => {
  try {
    await connectDB();
    const id = event.pathParameters.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "Invalid Story ID format" }),
      };
    }

    const story = await Story.findById(id).populate("author", "name");
    const populatedContent = await Promise.all(
      story.content.map(async (chapter) => {
        const user = await User.findById(chapter.createdBy).select("name");
        return {
          ...chapter.toObject(),
          createdBy: user,
        };
      })
    );

    story.content = populatedContent;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify(story),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error fetching story", error: error.message }),
    };
  }
};
