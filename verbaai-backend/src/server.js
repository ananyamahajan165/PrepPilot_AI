import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log("====================================");
      console.log(`🚀 Server Running`);
      console.log(`🌐 http://localhost:${env.PORT}`);
      console.log(`📦 Environment : ${env.NODE_ENV}`);
      console.log("====================================");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();