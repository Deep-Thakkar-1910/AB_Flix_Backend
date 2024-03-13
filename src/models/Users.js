import mongoose, { Schema } from "mongoose";

// defining the userSchema
const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [{ type: mongoose.SchemaTypes.ObjectId }],
  },
  { timestamps: true }
);

// defining the user model for consistent data schema along all users
export const User = mongoose.model("User", userSchema);
