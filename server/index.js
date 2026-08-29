require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NetflixGPT API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: process.env.MONGO_URI ? "configured" : "not-configured",
  });
});

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB", error.message);
    process.exit(1);
  }
};

startServer();
