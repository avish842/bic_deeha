import express from "express";
import {
  createStaff,
  getStaffMembers,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadStaffImage } from "../middlewares/upload.middleware.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

router.route("/")
  .get(getStaffMembers)
  .post(authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadStaffImage, createStaff);

router.route("/:id")
  .get(getStaffById)
  .put(authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadStaffImage, updateStaff)
  .delete(authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), deleteStaff);

export default router;
