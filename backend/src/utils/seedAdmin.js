import User from "../models/User.model.js";
import { ROLES } from "../constants/index.js";
import envConfig from "../config/env.config.js";

/**
 * Seeds a default SUPER_ADMIN user if none exists in the database.
 * Runs once during server startup.
 */
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: ROLES.SUPER_ADMIN });

    if (adminExists) {
      console.log("ℹ️  Admin user already exists. Skipping seed.");
      return;
    }

    const admin = await User.create({
      name: envConfig.ADMIN_NAME,
      email: envConfig.ADMIN_EMAIL,
      password: envConfig.ADMIN_PASSWORD,
      role: ROLES.SUPER_ADMIN,
    });

    console.log(`✅ Admin user seeded: ${admin.email}`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
  }
};

export default seedAdmin;
