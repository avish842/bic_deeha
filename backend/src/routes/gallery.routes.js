import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
  createGallery,
  getAllGalleries,
  getGalleryByCategory,
  deleteGallery,
} from "../controllers/gallery.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadGalleryImages } from "../middlewares/upload.middleware.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// Category routes
router.get("/categories", getAllCategories);
router.post("/categories", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), createCategory);
router.delete("/categories/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), deleteCategory);

// Gallery routes
router.get("/", getAllGalleries);
router.get("/category/:slug", getGalleryByCategory);
router.post("/", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), uploadGalleryImages, createGallery);
router.delete("/:id", authMiddleware, roleMiddleware(ROLES.SUPER_ADMIN), deleteGallery);

export default router;
