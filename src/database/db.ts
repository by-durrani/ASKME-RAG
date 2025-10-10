import mongoose from "mongoose";
export const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB URI not initialized");
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "rag-gpt" });
  } catch (error) {
    console.error(error);
  }
};
