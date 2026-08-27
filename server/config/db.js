const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    return false;
  }

  await mongoose.connect(mongoUri);
  return true;
};

module.exports = { connectToDatabase };
