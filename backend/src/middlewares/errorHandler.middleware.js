import ApiError from "../utils/ApiError.js";
import envConfig from "../config/env.config.js";

/**
 * Global error handling middleware.
 * Catches all errors thrown in the app and sends a uniform JSON response.
 */
const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error in development
  if (envConfig.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = ApiError.badRequest(`Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest("Validation Error", messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token.");
  }

  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token has expired.");
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    error = ApiError.badRequest("File size exceeds the allowed limit.");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(envConfig.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorHandler;
