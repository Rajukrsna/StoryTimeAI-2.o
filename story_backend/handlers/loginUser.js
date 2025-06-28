import User from "../models/User.js";
import  connectDB  from "../utils/connectDB.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js"; 

export const handler = async (event) => {
  try {
    await connectDB();
    const { email, password } = JSON.parse(event.body);
    const user = await User.findOne({ email });
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
         headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }
    const token = generateToken(user._id);

    return {
      statusCode: 200,
       headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
        },
      body: JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      }),
    };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      statusCode: 500,
       headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": true,
        },
      body: JSON.stringify({
        message: "Error logging in",
        error: error.message,
      }),
    };
  }
};
