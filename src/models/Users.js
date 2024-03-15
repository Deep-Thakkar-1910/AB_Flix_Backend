const mongoose = require("mongoose");

// defining the userSchema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, required: false },
    watchlist: [
      { type: mongoose.SchemaTypes.ObjectId, ref: ["Movie", "TvShow"] },
    ],
    refreshTokens: String,
  },
  { timestamps: true }
);

// defining the user model for consistent data schema along all users
const User = mongoose.model("User", userSchema);

module.exports = User;
