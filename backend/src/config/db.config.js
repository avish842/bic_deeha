import mongoose from "mongoose";
import envConfig from "./env.config.js";
import dns from "node:dns";

// Fix SRV resolutions by Google/Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("DEBUG MONGO_URI:", envConfig.MONGO_URI);
    const conn = await mongoose.connect(envConfig.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
