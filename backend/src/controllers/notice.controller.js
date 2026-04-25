import noticeService from "../services/notice.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Create a new notice
 * @route   POST /api/notices
 * @access  Private (SUPER_ADMIN)
 */
export const createNotice = asyncHandler(async (req, res) => {
  const { title, description, priority, expiryDate, isActive } = req.body;

  if (!title || !description) {
    throw ApiError.badRequest("Title and description are required.");
  }

  const notice = await noticeService.create(
    { title, description, priority, expiryDate, isActive },
    req.file,
    req.user._id
  );

  res.status(201).json(ApiResponse.created(notice, "Notice created successfully."));
});

/**
 * @desc    Get all notices
 * @route   GET /api/notices
 * @access  Public
 */
export const getAllNotices = asyncHandler(async (req, res) => {
  const result = await noticeService.getAll(req.query);

  res.status(200).json(ApiResponse.success(result, "Notices fetched successfully."));
});

/**
 * @desc    Get a single notice by ID
 * @route   GET /api/notices/:id
 * @access  Public
 */
export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await noticeService.getById(req.params.id);

  res.status(200).json(ApiResponse.success(notice, "Notice fetched successfully."));
});

/**
 * @desc    Update a notice
 * @route   PUT /api/notices/:id
 * @access  Private (SUPER_ADMIN)
 */
export const updateNotice = asyncHandler(async (req, res) => {
  const notice = await noticeService.update(req.params.id, req.body, req.file);

  res.status(200).json(ApiResponse.success(notice, "Notice updated successfully."));
});

/**
 * @desc    Delete a notice
 * @route   DELETE /api/notices/:id
 * @access  Private (SUPER_ADMIN)
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const result = await noticeService.delete(req.params.id);

  res.status(200).json(ApiResponse.success(result, "Notice deleted successfully."));
});
