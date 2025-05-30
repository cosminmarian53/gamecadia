const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Game name is required."],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required."],
  },
  company: {
    type: String,
    required: [true, "Company/Developer is required."],
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required."],
    min: [1950, "Release year seems too old."],
    max: [
      new Date().getFullYear() + 10,
      "Release year seems too far in the future.",
    ],
  },
  genres: {
    type: [String],
    default: [],
  },
  platforms: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  description: {
    type: String,
    default: "No description available.",
    trim: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the 'User' model
    required: [true, "A game must be added by a user."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update 'updatedAt'
gameSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-findOneAndUpdate hook to update 'updatedAt'
// Important for updates like findByIdAndUpdate
gameSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
