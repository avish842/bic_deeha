import { Router } from "express";
import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadAchievementImage } from "../middlewares/upload.middleware.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// Public routes
router.get("/", getAllAchievements);
router.get("/:id", getAchievementById);

// Protected routes (SUPER_ADMIN only)
router.post("/", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadAchievementImage, createAchievement);
router.put("/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadAchievementImage, updateAchievement);
router.delete("/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), deleteAchievement);

export default router;
