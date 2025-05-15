import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/praktika05";

export default async function initMongoose() {
  const readyState = mongoose.connection.readyState;
  console.log("MongoDB readyState:", readyState); // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  if (readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  if (readyState === 2) {
    console.log("MongoDB is connecting, waiting...");
    await new Promise((resolve) =>
      mongoose.connection.once("connected", resolve)
    );
    console.log("MongoDB connected");
    return;
  }

  console.log("Connecting to MongoDB:", MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("Mongoose connected");
  } catch (error) {
    console.error("Mongoose connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
