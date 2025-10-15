import mongoose from "mongoose";
import { DataAPIClient } from "@datastax/astra-db-ts";

export const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB URI not initialized");
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "rag-gpt" });
  } catch (error) {
    console.error(error);
  }
};

export const getAstraDB = () => {
  const client = new DataAPIClient(process.env.ASTRA_VEC_DB!);

  return client.db(process.env.ASTRA_VEC_DB_ENDPOINT!, {
    keyspace: process.env.ASTRA_VEC_DB_NAMESPACE!,
  });
};
