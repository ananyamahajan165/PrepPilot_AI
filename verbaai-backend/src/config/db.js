import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,
    });

    console.log("====================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database : ${connection.connection.name}`);
    console.log(`🌍 Host     : ${connection.connection.host}`);
    console.log("====================================");
  } catch (error) {
    console.error("====================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("====================================");

    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB Connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("🔴 MongoDB Disconnected");
});

mongoose.connection.on("error", (error) => {
  console.log("❌ MongoDB Error:", error.message);
});

export default connectDB;