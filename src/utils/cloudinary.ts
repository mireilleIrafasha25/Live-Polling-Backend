
import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Optionally, define a type-safe interface for environment variables
const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_KEY || "",
  api_secret: process.env.CLOUD_SECRET || "",
  timeout: 60000,
};

// Check for missing env variables (optional but good practice)
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  throw new Error("Missing Cloudinary environment variables");
}

// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

export default cloudinary;
