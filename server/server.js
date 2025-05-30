const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import CORS

const app = express();
const port = 3001;

// MongoDB Atlas connection string. The database name is part of the URI.
const mongoUrl =
  "mongodb+srv://dbking:dbking123@cluster0.9foznzi.mongodb.net/gamecadiaDataB?retryWrites=true&w=majority";
// const dbName = "gamecadiaDataB"; // This will be inferred from mongoUrl if it contains the DB name.
// Or, if you specify it in client.db(), make sure it's exact.
const effectiveDbName = "gamecadiaDataB"; // Explicitly the DB name you want to use.
const collectionName = "gameElements"; // CORRECTED: Use this for structured game data

let db;

const initialGameData = [
  {
    id: 1, // Simple ID for initial data, MongoDB will add a unique _id
    href: "https://www.y8.com/games/uphill_bus_simulator_3d",
    imgSrc:
      "https://img.y8.com/cloud/v2-y8-thumbs-small-thumbnails-001/126323/small.gif",
    imgAlt: "Uphill Bus Simulator 3D",
    title: "Uphill Bus Simulator 3D",
    callToAction: "Play Now!",
  },
  {
    id: 2,
    href: "https://www.y8.com/games/traffic_jam_3d",
    imgSrc:
      "https://img.y8.com/cloud/v2-y8-thumbs-small-thumbnails-001/152016/small.gif",
    imgAlt: "Traffic Jam 3D",
    title: "Traffic Jam 3D",
    callToAction: "Play Now!",
  },
  // ... (other initial game data)
];

async function connectToDbAndInsertData() {
  try {
    const client = new MongoClient(mongoUrl, {
      useNewUrlParser: true, // Deprecated but often kept for older tutorials
      useUnifiedTopology: true, // Standard option
    });
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas");
    // If dbName is in mongoUrl, client.db() without args uses it.
    // Or, explicitly: client.db(effectiveDbName)
    db = client.db(effectiveDbName);
    const collection = db.collection(collectionName);

    const count = await collection.countDocuments();
    if (count === 0) {
      console.log(
        `Collection '${collectionName}' in database '${effectiveDbName}' is empty. Inserting initial data.`
      );
      const result = await collection.insertMany(initialGameData);
      console.log(`${result.insertedCount} game data objects were inserted.`);
    } else {
      console.log(
        `Collection '${collectionName}' already contains ${count} documents. Skipping initial insertion.`
      );
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB or process data:", err);
    db = null;
    // Don't exit process immediately in dev, allow for retries or further debugging
    // process.exit(1);
  }
}

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// GET all game elements
app.get("/api/elements", async (req, res) => {
  if (!db) {
    console.error("GET /api/elements: Database not available");
    return res.status(503).json({
      message: "Service temporarily unavailable. Please try again later.",
    });
  }
  try {
    const collection = db.collection(collectionName);
    const elements = await collection.find({}).toArray();
    res.json(elements);
  } catch (error) {
    console.error("GET /api/elements: Failed to fetch elements:", error);
    res.status(500).json({
      message: "Error fetching elements from database",
      error: error.message,
    });
  }
});

// POST a new game element
app.post("/api/elements", async (req, res) => {
  if (!db) {
    console.error("POST /api/elements: Database not available");
    return res.status(503).json({
      message: "Service temporarily unavailable. Please try again later.",
    });
  }
  try {
    const newGame = req.body;
    if (!newGame || !newGame.title || !newGame.href) {
      return res
        .status(400)
        .json({ message: "Missing required fields (title, href)" });
    }

    const collection = db.collection(collectionName);
    const result = await collection.insertOne(newGame);

    if (result.insertedId) {
      const insertedGame = await collection.findOne({ _id: result.insertedId });
      res.status(201).json(insertedGame);
    } else {
      // Should not happen if insertOne succeeds without error
      res
        .status(500)
        .json({ message: "Game added but could not retrieve confirmation." });
    }
  } catch (error) {
    console.error("POST /api/elements: Failed to add new game:", error);
    res.status(500).json({
      message: "Error adding new game to database",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send(
    `Game Elements API Server is running. Collection: ${collectionName}. DB: ${effectiveDbName}. Try GET or POST /api/elements.`
  );
});

async function startServer() {
  await connectToDbAndInsertData();
  if (db) {
    // Only start listening if DB connection was successful
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } else {
    console.error("Server not started due to database connection issues.");
  }
}

startServer();
