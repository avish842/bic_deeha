import { Router } from "express";
import {
  addHeroImage,
  getActiveHeroImages,
  getAllHeroImagesAdmin,
  toggleHeroImageStatus,
  deleteHeroImage,
} from "../controllers/heroImage.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadHeroImage } from "../middlewares/upload.middleware.js";

const router = Router();

// Public route
router.get("/active", getActiveHeroImages);

// Admin routes
router.use(authMiddleware, roleMiddleware("SUPER_ADMIN", "ADMIN"));
router.get("/admin", getAllHeroImagesAdmin);
router.post("/", uploadHeroImage, addHeroImage);
router.patch("/:id/toggle", toggleHeroImageStatus);
router.delete("/:id", deleteHeroImage);

export default router;