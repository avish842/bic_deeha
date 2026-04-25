import achievementService from "../services/achievement.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Create a new achievement
 * @route   POST /api/achievements
 * @access  Private (SUPER_ADMIN)
 */
export const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, type, date } = req.body;

  if (!title || !description || !type) {
    throw ApiError.badRequest("Title, description, and type are required.");
  }

  const achievement = await achievementService.create(
    { title, description, type, date },
    req.file
  );

  res.status(201).json(ApiResponse.created(achievement, "Achievement created successfully."));
});

/**
 * @desc    Get all achievements
 * @route   GET /api/achievements
 * @access  Public
 */
export const getAllAchievements = asyncHandler(async (req, res) => {
  const result = await achievementService.getAll(req.query);

  res.status(200).json(ApiResponse.success(result, "Achievements fetched successfully."));
});

/**
 * @desc    Get a single achievement by ID
 * @route   GET /api/achievements/:id
 * @access  Public
 */
export const getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await achievementService.getById(req.params.id);

  res.status(200).json(ApiResponse.success(achievement, "Achievement fetched successfully."));
});

/**
 * @desc    Update an achievement
 * @route   PUT /api/achievements/:id
 * @access  Private (SUPER_ADMIN)
 */
export const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await achievementService.update(req.params.id, req.body, req.file);

  res.status(200).json(ApiResponse.success(achievement, "Achievement updated successfully."));
});

/**
 * @desc    Delete an achievement
 * @route   DELETE /api/achievements/:id
 * @access  Private (SUPER_ADMIN)
 */
export const deleteAchievement = asyncHandler(async (req, res) => {
  const result = await achievementService.delete(req.params.id);

  res.status(200).json(ApiResponse.success(result, "Achievement deleted successfully."));
});
