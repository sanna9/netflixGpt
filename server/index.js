require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const recommendationRoutes = require("./routes/recommendations");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || true }));
const requireDatabase = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed", error.message);
    const message =
      process.env.NODE_ENV === "production"
        ? "Database is temporarily unavailable"
        : `Database connection failed: ${error.message}`;
    res.status(503).json({ message });
  }
};
app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/watchlist", requireDatabase, watchlistRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NetflixGPT API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check database failure", error.message);
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message:
        process.env.NODE_ENV === "production"
          ? "Database is temporarily unavailable"
          : error.message,
    });
  }
});

const startServer = () => {
  if (!process.env.JWT_SECRET) {
    console.error("Unable to start API: JWT_SECRET is not configured");
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
};

if (require.main === module) startServer();

module.exports = app;
