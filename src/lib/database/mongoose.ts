import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = {
  conn: null,
  promise: null,
};

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL environment variable.");
  }

  cached.promise = mongoose.connect(MONGODB_URL, {
    dbName: "imaginify",
    bufferCommands: false,
  });

  cached.conn = await cached.promise;

  return cached.conn;
};
