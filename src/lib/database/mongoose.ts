// import mongoose, { Mongoose } from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL;

// interface MongooseConnection {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

// let cached: MongooseConnection = {
//   conn: null,
//   promise: null,
// };

// export const connectToDatabase = async (): Promise<Mongoose> => {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!MONGODB_URL) {
//     console.error("MONGODB_URL is not defined in the environment variables.");
//     console.log("process.env:", process.env);
//     throw new Error("Missing MONGODB_URL environment variable.");
//   }

//   try {
//     cached.promise = mongoose.connect(MONGODB_URL, {
//       dbName: "imaginify",
//       bufferCommands: false,
//     });

//     cached.conn = await cached.promise;
//     console.log("Connected to MongoDB successfully");
//     return cached.conn;
//   } catch (error) {
//     console.error("Failed to connect to MongoDB:", error);
//     throw error;
//   }
// };

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "imaginify",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
