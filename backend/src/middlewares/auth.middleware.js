import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import envConfig from "../config/env.config.js";

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches user object to req.user on success.
 */
const authMiddleware = asyncHandler(async (req, _res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not found. Token is invalid.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized("Invalid or expired token.");
  }
});

export default authMiddleware;
