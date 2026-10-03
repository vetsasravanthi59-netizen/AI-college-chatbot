import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college_chatbot';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick fail if local MongoDB is not running
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not reachable (${err.message}).`);
    console.log(`[Database] Falling back to high-fidelity In-Memory Data Store with 25 preloaded demo FAQs.`);
    return false;
  }
}

export function getMongoStatus() {
  return isMongoConnected;
}
