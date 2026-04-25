import Gallery from "../models/Gallery.model.js";
import GalleryCategory from "../models/GalleryCategory.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";
import appConfig from "../config/app.config.js";

class GalleryService {
  // ─── Category Methods ──────────────────────

  /**
   * Create a new gallery category.
   */
  async createCategory(name) {
    const existing = await GalleryCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

    if (existing) {
      throw ApiError.badRequest("Category already exists.");
    }

    const category = await GalleryCategory.create({ name });
    return category;
  }

  /**
   * Get all gallery categories.
   */
  async getAllCategories() {
    const categories = await GalleryCategory.find().sort({ name: 1 });
    return categories;
  }

  /**
   * Delete a gallery category and all associated galleries.
   */
  async deleteCategory(id) {
    const category = await GalleryCategory.findById(id);
    if (!category) throw ApiError.notFound("Category not found.");

    // Delete all gallery entries and their images
    const galleries = await Gallery.find({ category: id });
    for (const gallery of galleries) {
      for (const image of gallery.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }
    await Gallery.deleteMany({ category: id });
    await GalleryCategory.findByIdAndDelete(id);

    return { message: "Category and all associated galleries deleted." };
  }

  // ─── Gallery Methods ───────────────────────

  /**
   * Create a new gallery entry with multiple images.
   */
  async create(data, files, userId) {
    const category = await GalleryCategory.findById(data.category);
    if (!category) {
      throw ApiError.badRequest("Invalid category.");
    }

    const images = files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const gallery = await Gallery.create({
      title: data.title,
      category: data.category,
      images,
      createdBy: userId,
    });

    return gallery.populate([
      { path: "category", select: "name slug" },
      { path: "createdBy", select: "name email" },
    ]);
  }

  /**
   * Get all gallery entries with pagination.
   */
  async getAll(query = {}) {
    const {
      page = appConfig.PAGINATION.DEFAULT_PAGE,
      limit = appConfig.PAGINATION.DEFAULT_LIMIT,
      category,
    } = query;

    const filter = {};
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), appConfig.PAGINATION.MAX_LIMIT);

    const [galleries, total] = await Promise.all([
      Gallery.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("category", "name slug")
        .populate("createdBy", "name email"),
      Gallery.countDocuments(filter),
    ]);

    return {
      galleries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  /**
   * Get galleries by category slug.
   */
  async getByCategory(slug) {
    const category = await GalleryCategory.findOne({ slug });
    if (!category) throw ApiError.notFound("Category not found.");

    const galleries = await Gallery.find({ category: category._id })
      .sort({ createdAt: -1 })
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    return { category, galleries };
  }

  /**
   * Delete a gallery entry and its images from Cloudinary.
   */
  async delete(id) {
    const gallery = await Gallery.findById(id);
    if (!gallery) throw ApiError.notFound("Gallery not found.");

    // Delete images from Cloudinary
    for (const image of gallery.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    await Gallery.findByIdAndDelete(id);

    return { message: "Gallery deleted successfully." };
  }
}

export default new GalleryService();
