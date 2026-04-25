import Notice from "../models/Notice.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";
import appConfig from "../config/app.config.js";

class NoticeService {
  /**
   * Create a new notice.
   */
  async create(data, file, userId) {
    const noticeData = {
      ...data,
      createdBy: userId,
    };

    if (file) {
      noticeData.file = {
        url: file.path,
        publicId: file.filename,
        fileName: file.originalname,
      };
    }

    const notice = await Notice.create(noticeData);
    return notice;
  }

  /**
   * Get all notices with pagination and optional filters.
   */
  async getAll(query = {}) {
    const {
      page = appConfig.PAGINATION.DEFAULT_PAGE,
      limit = appConfig.PAGINATION.DEFAULT_LIMIT,
      priority,
      isActive,
    } = query;

    const filter = {};

    if (priority) filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), appConfig.PAGINATION.MAX_LIMIT);

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "name email"),
      Notice.countDocuments(filter),
    ]);

    return {
      notices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  /**
   * Get a single notice by ID.
   */
  async getById(id) {
    const notice = await Notice.findById(id).populate("createdBy", "name email");

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    return notice;
  }

  /**
   * Update a notice by ID.
   */
  async update(id, data, file) {
    const notice = await Notice.findById(id);

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    // If new file is uploaded, delete old one from Cloudinary
    if (file) {
      if (notice.file?.publicId) {
        await cloudinary.uploader.destroy(notice.file.publicId);
      }

      data.file = {
        url: file.path,
        publicId: file.filename,
        fileName: file.originalname,
      };
    }

    const updatedNotice = await Notice.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    return updatedNotice;
  }

  /**
   * Delete a notice by ID (also removes file from Cloudinary).
   */
  async delete(id) {
    const notice = await Notice.findById(id);

    if (!notice) {
      throw ApiError.notFound("Notice not found.");
    }

    // Delete file from Cloudinary if exists
    if (notice.file?.publicId) {
      await cloudinary.uploader.destroy(notice.file.publicId);
    }

    await Notice.findByIdAndDelete(id);

    return { message: "Notice deleted successfully." };
  }
}

export default new NoticeService();
