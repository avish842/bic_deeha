import galleryService from "../services/gallery.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Create a new gallery category
 * @route   POST /api/gallery/categories
 * @access  Private (SUPER_ADMIN)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw ApiError.badRequest("Category name is required.");
  }

  const category = await galleryService.createCategory(name);

  res.status(201).json(ApiResponse.created(category, "Category created successfully."));
});

/**
 * @desc    Get all gallery categories
 * @route   GET /api/gallery/categories
 * @access  Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await galleryService.getAllCategories();

  res.status(200).json(ApiResponse.success(categories, "Categories fetched successfully."));
});

/**
 * @desc    Delete a gallery category
 * @route   DELETE /api/gallery/categories/:id
 * @access  Private (SUPER_ADMIN)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await galleryService.deleteCategory(req.params.id);

  res.status(200).json(ApiResponse.success(result, "Category deleted successfully."));
});

/**
 * @desc    Create a new gallery entry with images
 * @route   POST /api/gallery
 * @access  Private (SUPER_ADMIN)
 */
export const createGallery = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  if (!title || !category) {
    throw ApiError.badRequest("Title and category are required.");
  }

  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest("At least one image is required.");
  }

  const gallery = await galleryService.create(req.body, req.files, req.user._id);

  res.status(201).json(ApiResponse.created(gallery, "Gallery created successfully."));
});

/**
 * @desc    Get all galleries
 * @route   GET /api/gallery
 * @access  Public
 */
export const getAllGalleries = asyncHandler(async (req, res) => {
  const result = await galleryService.getAll(req.query);

  res.status(200).json(ApiResponse.success(result, "Galleries fetched successfully."));
});

/**
 * @desc    Get galleries by category slug
 * @route   GET /api/gallery/category/:slug
 * @access  Public
 */
export const getGalleryByCategory = asyncHandler(async (req, res) => {
  const result = await galleryService.getByCategory(req.params.slug);

  res.status(200).json(ApiResponse.success(result, "Galleries fetched successfully."));
});

/**
 * @desc    Delete a gallery entry
 * @route   DELETE /api/gallery/:id
 * @access  Private (SUPER_ADMIN)
 */
export const deleteGallery = asyncHandler(async (req, res) => {
  const result = await galleryService.delete(req.params.id);

  res.status(200).json(ApiResponse.success(result, "Gallery deleted successfully."));
});
