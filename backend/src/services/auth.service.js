import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
  /**
   * Authenticate user with email and password.
   * Returns user data and JWT token.
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    const token = user.generateToken();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  /**
   * Get current user profile by ID.
   */
  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    return user;
  }
}

export default new AuthService();
