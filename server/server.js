const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Ensure .env file is used if MONGO_URI is there

// Import models (adjust paths if your structure is different)
const User = require("./models/User");
const Game = require("./models/Game");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// --- MongoDB Connection ---
mongoose.set("strictQuery", false); // Recommended for Mongoose 6+ to prepare for Mongoose 7 behavior
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log(
      `[${new Date().toISOString()}] DB: Successfully connected to MongoDB at ${
        mongoose.connection.host
      }, DB: ${mongoose.connection.name}`
    );
    await initializeDefaultGames(); // Seed default games if needed
  })
  .catch((err) => {
    console.error(
      `[${new Date().toISOString()}] DB: MongoDB Connection Error - ${
        err.message
      }`
    );
    console.error("Full MongoDB connection error object:", err);
    process.exit(1); // Exit application if DB connection fails
  });

// --- Authentication Middleware ---
// (Token is expected to be the user's MongoDB _id string)
const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(token)) {
      return res
        .status(401)
        .json({ message: "Access denied. Invalid token format." });
    }
    const user = await User.findById(token);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Access denied. Invalid token (user not found)." });
    }
    req.user = { id: user._id.toString() }; // Attach user ID to request object
    next();
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] AUTH: Middleware error - ${error.message}`,
      error
    );
    res.status(500).json({ message: "Authentication error." });
  }
};

// --- Database Initialization (Default Games) ---
const initializeDefaultGames = async () => {
  try {
    const gameCount = await Game.countDocuments();
    if (gameCount === 0) {
      console.log(
        `[${new Date().toISOString()}] DB: No games found. Seeding default games...`
      );
      let systemUser = await User.findOne({ email: "system@gamecadia.com" });
      if (!systemUser) {
        systemUser = new User({
          username: "GamecadiaSystem",
          email: "system@gamecadia.com",
          password: `SystemPassword${Date.now()}`, // Ensure unique, strong password
          profilePicture: `https://ui-avatars.com/api/?name=System&background=1D4ED8&color=fff&size=128`,
        });
        await systemUser.save();
        console.log(
          `[${new Date().toISOString()}] DB: Created 'GamecadiaSystem' user with ID: ${
            systemUser._id
          }`
        );
      }

      const defaultGamesData = [
        {
          name: "Cosmic Runner",
          imageUrl:
            "https://placehold.co/600x400/1D4ED8/FFFFFF/PNG?text=Cosmic+Runner",
          company: "Galaxy Interactive",
          releaseYear: 2024,
          genres: ["Sci-Fi", "Runner"],
          platforms: ["PC", "Mobile"],
          rating: 85,
          description:
            "Run through the cosmos, dodging asteroids and collecting stardust.",
          addedBy: systemUser._id,
        },
        {
          name: "Pixel Kingdom",
          imageUrl:
            "https://placehold.co/600x400/10B981/FFFFFF/PNG?text=Pixel+Kingdom",
          company: "Retro Studios",
          releaseYear: 2023,
          genres: ["RPG", "Pixel Art"],
          platforms: ["PC", "Switch"],
          rating: 90,
          description: "Build your kingdom in a charming pixelated world.",
          addedBy: systemUser._id,
        },
      ];
      await Game.insertMany(defaultGamesData);
      console.log(
        `[${new Date().toISOString()}] DB: ${
          defaultGamesData.length
        } default games seeded successfully.`
      );
    } else {
      console.log(
        `[${new Date().toISOString()}] DB: ${gameCount} games already exist. Skipping default seed.`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] DB: Error initializing default games - ${
        error.message
      }`,
      error
    );
  }
};

// --- API ROUTES ---

// User Routes
app.post("/api/users/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }
  try {
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or username." });
    }
    user = new User({
      username,
      email: email.toLowerCase(),
      password, // Hashing handled by pre-save hook
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&background=1D4ED8&color=fff&size=128`,
    });
    await user.save();
    res.status(201).json({
      message: "User registered successfully.",
      token: user._id.toString(),
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /users/register error - ${
        error.message
      }`,
      error
    );
    if (error.name === "ValidationError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error during registration." });
  }
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    user.lastLogin = new Date();
    await user.save();
    res.json({
      token: user._id.toString(),
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      publishedGames: user.publishedGames,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /users/login error - ${
        error.message
      }`,
      error
    );
    res.status(500).json({ message: "Server error during login." });
  }
});

app.get("/api/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("publishedGames");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /users/me error - ${error.message}`,
      error
    );
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// Game Routes
app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find()
      .sort({ createdAt: -1 })
      .populate("addedBy", "username");
    res.json(games);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /games GET error - ${error.message}`,
      error
    );
    res.status(500).json({ message: "Server error fetching games." });
  }
});

app.get("/api/games/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid game ID format." });
    }
    const game = await Game.findById(req.params.id).populate(
      "addedBy",
      "username"
    );
    if (!game) return res.status(404).json({ message: "Game not found." });
    res.json(game);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /games/:id GET error - ${
        error.message
      }`,
      error
    );
    res.status(500).json({ message: "Server error fetching game details." });
  }
});

app.post("/api/games", auth, async (req, res) => {
  console.log(
    `[${new Date().toISOString()}] API: POST /api/games by user ${
      req.user.id
    }. Body:`,
    JSON.stringify(req.body, null, 2)
  );
  const {
    name,
    imageUrl,
    company,
    releaseYear,
    genres,
    platforms,
    rating,
    description,
  } = req.body;

  if (!name || !imageUrl || !company || !releaseYear) {
    return res.status(400).json({
      message: "Missing required fields: name, imageUrl, company, releaseYear.",
    });
  }
  try {
    const newGame = new Game({
      ...req.body, // Spread all fields from body
      addedBy: req.user.id, // Override addedBy with authenticated user ID
    });
    const savedGame = await newGame.save();
    await User.findByIdAndUpdate(req.user.id, {
      $push: { publishedGames: savedGame._id },
    });
    console.log(
      `[${new Date().toISOString()}] API: Game CREATED: ${
        savedGame.name
      } (ID: ${savedGame._id}) by user ${req.user.id}`
    );
    res.status(201).json(savedGame);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: POST /api/games error - ${
        error.message
      }`,
      error
    );
    if (error.name === "ValidationError")
      return res.status(400).json({
        message: "Validation Error: " + error.message,
        errors: error.errors,
      });
    res.status(500).json({ message: "Server error creating game." });
  }
});

app.put("/api/games/:id", auth, async (req, res) => {
  const gameId = req.params.id;
  // console.log(`[${new Date().toISOString()}] API: PUT /api/games/${gameId} by user ${req.user.id}. Body:`, req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid game ID format." });
    }
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found." });
    if (game.addedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this game." });
    }

    // Construct update object, explicitly excluding 'addedBy' and 'createdAt'
    const {
      name,
      imageUrl,
      company,
      releaseYear,
      genres,
      platforms,
      rating,
      description,
    } = req.body;
    const updateData = {
      name,
      imageUrl,
      company,
      releaseYear,
      genres,
      platforms,
      rating,
      description,
    };
    // Remove undefined fields to prevent accidental clearing
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.json(updatedGame);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: PUT /api/games/:id error - ${
        error.message
      }`,
      error
    );
    if (error.name === "ValidationError")
      return res.status(400).json({
        message: "Validation Error: " + error.message,
        errors: error.errors,
      });
    res.status(500).json({ message: "Server error updating game." });
  }
});

app.delete("/api/games/:id", auth, async (req, res) => {
  const gameId = req.params.id;
  // console.log(`[${new Date().toISOString()}] API: DELETE /api/games/${gameId} by user ${req.user.id}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid game ID format." });
    }
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found." });
    if (game.addedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this game." });
    }
    await Game.findByIdAndDelete(gameId);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { publishedGames: gameId },
    });
    res.json({ message: "Game deleted successfully." });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: DELETE /api/games/:id error - ${
        error.message
      }`,
      error
    );
    res.status(500).json({ message: "Server error deleting game." });
  }
});

// Get games by a specific user
app.get("/api/users/:userId/games", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    const games = await Game.find({ addedBy: userId })
      .sort({ createdAt: -1 })
      .populate("addedBy", "username");
    res.json(games);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] API: /users/:userId/games error - ${
        error.message
      }`,
      error
    );
    res.status(500).json({ message: "Server error fetching user's games." });
  }
});

// Serve React App (Static Assets) in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build"))); // Adjust path if client is outside server folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html")); // Adjust path
  });
} else {
  app.get("/", (req, res) => {
    res.send("Gamecadia API is running in development mode.");
  });
}

// Global Error Handler (Optional basic one)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] GLOBAL ERROR: ${err.stack}`);
  res.status(500).send("Something broke on the server!");
});

app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] SERVER: Gamecadia server running on http://localhost:${PORT}`
  );
});
