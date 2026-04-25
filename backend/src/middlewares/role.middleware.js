import ApiError from "../utils/ApiError.js";

/**
 * Role-based access control middleware.
 * Accepts an array of allowed roles and checks req.user.role.
 * Designed for scalability — currently only SUPER_ADMIN exists.
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

export default roleMiddleware;
