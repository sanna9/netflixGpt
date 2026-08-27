const mongoose = require("mongoose");

const atlasHosts = [
  "ac-fsbz4sa-shard-00-00.ay6hlyq.mongodb.net:27017",
  "ac-fsbz4sa-shard-00-01.ay6hlyq.mongodb.net:27017",
  "ac-fsbz4sa-shard-00-02.ay6hlyq.mongodb.net:27017",
].join(",");

const getConnectionUri = (mongoUri) => {
  if (!mongoUri.startsWith("mongodb+srv://")) {
    return mongoUri;
  }

  const connectionDetails = mongoUri.match(/^mongodb\+srv:\/\/(.+?)@[^/]+\/(.*)$/);
  if (!connectionDetails) {
    throw new Error("MONGO_URI has an invalid MongoDB Atlas format");
  }

  const [, credentials, databaseAndQuery] = connectionDetails;
  const [database] = databaseAndQuery.split("?");
  return `mongodb://${credentials}@${atlasHosts}/${database}?authSource=admin&replicaSet=atlas-u47rt1-shard-0&tls=true`;
};

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(getConnectionUri(mongoUri));
  await mongoose.connection.db.admin().ping();
  console.log("Connected to MongoDB");
};

module.exports = { connectToDatabase };
