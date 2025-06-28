import  connectDB  from "../utils/connectDB.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const handler = async (event) => {
  try {
    await connectDB();
    const body = JSON.parse(event.body);
    const { name, email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
        body: JSON.stringify({ message: "User already exists" }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture: "", // Upload handled separately
    });

    await newUser.save();
    const token = generateToken(newUser._id);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({ message: "Error", error: err.message }),
    };
  }
};
