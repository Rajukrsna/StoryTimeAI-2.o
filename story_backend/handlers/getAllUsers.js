
import  connectDB  from "../utils/connectDB.js";
import User from "../models/User.js";

export const handler = async (event) => {
try{
    await connectDB();
    const authors = await User.find({}, "name bio profilePicture");
    return{
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify(
          authors.map((author) => ({
            _id: author._id,
            name: author.name,
            bio: author.bio || "",
            profileImage: author.profilePicture || "/default.jpg", // fallback image
          }))
        ),
    }
  } catch (error) {
    console.error("Error in /all route:", error);
    return{
        statusCode: 500,
        headers: {
        "Access-Control-Allow-Origin": "https://story-time-ai-2-o.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "Error fetching user profile", error: error.message }), 
    }
  }
}