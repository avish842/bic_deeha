import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  searchByAdmissionNumber,
  getStudentById,
  updateStudent,
  deleteStudent,
  getToppers,
} from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadStudentImage } from "../middlewares/upload.middleware.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// Public routes for toppers
router.get("/toppers", getToppers);

// Protected routes (SUPER_ADMIN only)
router.use(authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN));
router.get("/", getAllStudents);
router.get("/search/:admissionNumber", searchByAdmissionNumber);
router.get("/:id", getStudentById);
router.post("/", uploadStudentImage, createStudent);
router.put("/:id", uploadStudentImage, updateStudent);
router.delete("/:id", deleteStudent);

export default router;
