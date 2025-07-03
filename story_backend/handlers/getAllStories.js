import Story from "../models/Story.js";
import connectDB from "../utils/connectDB.js";
import "../models/User.js";

export const handler = async (event) => {
  try {
    await connectDB();
    const { search, sort } = event.queryStringParameters || {};
    let filter = {};

    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: { $regex: safeSearch, $options: "i" } }];
    }

    let query = Story.find(filter).populate("author", "name profilePicture");

    if (sort === "latest") query.sort({ createdAt: -1 });
    else if (sort === "oldest") query.sort({ createdAt: 1 });
    else if (sort === "top") query.sort({ votes: -1 });

    const stories = await query.lean();

    return {
      statusCode: 200,
       headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify(stories),
    };
  } catch (error) {
    return {
      statusCode: 500,
       headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error fetching stories", error: error.message }),
    };
  }
};
