const mongoose = require("mongoose");

let connectionPromise;

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
  await mongoose.connection.db.admin().ping();
  console.log("Connected to MongoDB");
};

module.exports = { connectToDatabase };
