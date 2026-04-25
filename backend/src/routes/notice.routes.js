import { Router } from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadNoticeFile } from "../middlewares/upload.middleware.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// Public routes
router.get("/", getAllNotices);
router.get("/:id", getNoticeById);

// Protected routes (SUPER_ADMIN only)
router.post("/", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadNoticeFile, createNotice);
router.put("/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadNoticeFile, updateNotice);
router.delete("/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), deleteNotice);

export default router;
