require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: process.env.MONGO_URI ? "configured" : "not-configured",
  });
});

const startServer = async () => {
  try {
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
