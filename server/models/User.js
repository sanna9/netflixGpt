const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoURL: String,
    watchlist: [
      {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        poster_path: String,
        backdrop_path: String,
        overview: String,
        release_date: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
