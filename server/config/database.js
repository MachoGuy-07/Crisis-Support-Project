const mongoose = require("mongoose");

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/crisis-support";

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 12000,
  });

  console.log(`[server] MongoDB connected: ${mongoUri}`);
}

module.exports = { connectDatabase };
