import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    profilePicture: {
      type: String, // URL to profile picture
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // ✅ Valid default profile picture
    },
    bio: {
      type: String,
      default: "Hello! I'm a storyteller.",
      maxlength: [200, "Bio must be at most 200 characters"],
    },
   contributions: [
  {
    title: { type: String, required: true },
    score: { type: Number, required: true }
  }
],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    console.log(" Hashing password:", this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("✅ Hashed password:", this.password); // Log the hashed password
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    return next(error);
  }

  next();
});

// ✅ Validate password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export default User;
