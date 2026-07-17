import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5001,

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/verbaai",

  JWT_SECRET:
    process.env.JWT_SECRET ||
    "your_super_secret_key",

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN || "7d",

  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET ||
    "your_refresh_secret",

  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME,

  CLOUDINARY_API_KEY:
    process.env.CLOUDINARY_API_KEY,

  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
