import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import envConfig from "./src/config/env.config.js";
import appConfig from "./src/config/app.config.js";
import connectDB from "./src/config/db.config.js";
import seedAdmin from "./src/utils/seedAdmin.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";

// Route imports
import authRoutes from "./src/routes/auth.routes.js";
import noticeRoutes from "./src/routes/notice.routes.js";
import galleryRoutes from "./src/routes/gallery.routes.js";
import achievementRoutes from "./src/routes/achievement.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import heroRoutes from "./src/routes/hero.routes.js";

const app = express();

// ─── Core Middleware ─────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: `${appConfig.APP_NAME} API is running`,
    version: appConfig.VERSION,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/hero", heroRoutes);

// ─── 404 Handler ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler ────────────────────
app.use(errorHandler);

// ─── Server Start ────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(envConfig.PORT, () => {
      console.log(`\n🚀 ${appConfig.APP_NAME} v${appConfig.VERSION}`);
      console.log(`📡 Server running on port ${envConfig.PORT}`);
      console.log(`🌍 Environment: ${envConfig.NODE_ENV}`);
      console.log(`📋 Health: http://localhost:${envConfig.PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
