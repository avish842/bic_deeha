import dotenv from "dotenv";
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.log("DOTENV ERROR:", dotenvResult.error);
}
console.log("LOADED MONGO_URI from env:", process.env.MONGO_URI);

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/college-website",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret_change_me",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  ADMIN_NAME: process.env.ADMIN_NAME || "Super Admin",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@college.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123",

  NODE_ENV: process.env.NODE_ENV || "development",
};

export default envConfig;
