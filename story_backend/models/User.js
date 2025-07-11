import mongoose, { Schema, model } from "mongoose";
//import bcrypt from "bcryptjs";

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
    // Add these new fields for follow functionality
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// // Pre-save hook to hash password (if not already hashed, and if password is modified)
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password") && this.password) {
//     // Only hash if the password is a new string and not already hashed
//     // Note: The current register route directly assigns password without hashing.
//     // You should uncomment and use bcrypt.hash here if you want to hash passwords.
//     // this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const User = model("User", userSchema);
export default User;