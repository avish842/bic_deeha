import Achievement from "../models/Achievement.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";
import appConfig from "../config/app.config.js";

class AchievementService {
  /**
   * Create a new achievement.
   */
  async create(data, file) {
    const achievementData = { ...data };

    if (file) {
      achievementData.image = {
        url: file.path,
        publicId: file.filename,
      };
    }

    const achievement = await Achievement.create(achievementData);
    return achievement;
  }

  /**
   * Get all achievements with pagination and optional type filter.
   */
  async getAll(query = {}) {
    const {
      page = appConfig.PAGINATION.DEFAULT_PAGE,
      limit = appConfig.PAGINATION.DEFAULT_LIMIT,
      type,
    } = query;

    const filter = {};
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), appConfig.PAGINATION.MAX_LIMIT);

    const [achievements, total] = await Promise.all([
      Achievement.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum),
      Achievement.countDocuments(filter),
    ]);

    return {
      achievements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  /**
   * Get a single achievement by ID.
   */
  async getById(id) {
    const achievement = await Achievement.findById(id);
    if (!achievement) throw ApiError.notFound("Achievement not found.");
    return achievement;
  }

  /**
   * Update an achievement by ID.
   */
  async update(id, data, file) {
    const achievement = await Achievement.findById(id);
    if (!achievement) throw ApiError.notFound("Achievement not found.");

    if (file) {
      if (achievement.image?.publicId) {
        await cloudinary.uploader.destroy(achievement.image.publicId);
      }
      data.image = {
        url: file.path,
        publicId: file.filename,
      };
    }

    const updated = await Achievement.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  /**
   * Delete an achievement and its image from Cloudinary.
   */
  async delete(id) {
    const achievement = await Achievement.findById(id);
    if (!achievement) throw ApiError.notFound("Achievement not found.");

    if (achievement.image?.publicId) {
      await cloudinary.uploader.destroy(achievement.image.publicId);
    }

    await Achievement.findByIdAndDelete(id);

    return { message: "Achievement deleted successfully." };
  }
}

export default new AchievementService();
