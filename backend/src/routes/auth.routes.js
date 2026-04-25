import { Router } from "express";
import { login, getProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authMiddleware, getProfile);

export default router;
