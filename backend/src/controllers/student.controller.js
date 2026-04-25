import studentService from "../services/student.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Add a new student
 * @route   POST /api/students
 * @access  Private (SUPER_ADMIN)
 */
export const createStudent = asyncHandler(async (req, res) => {
  const { name, admissionNumber, currentClass } = req.body;

  if (!name || !admissionNumber || !currentClass) {
    throw ApiError.badRequest("Name, admission number, and current class are required.");
  }

  const student = await studentService.create(req.body, req.file);

  res.status(201).json(ApiResponse.created(student, "Student added successfully."));
});

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Public
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getAll(req.query);

  res.status(200).json(ApiResponse.success(result, "Students fetched successfully."));
});

/**
 * @desc    Search student by admission number
 * @route   GET /api/students/search/:admissionNumber
 * @access  Public
 */
export const searchByAdmissionNumber = asyncHandler(async (req, res) => {
  const student = await studentService.searchByRollNumber(req.params.admissionNumber);

  res.status(200).json(ApiResponse.success(student, "Student found."));
});

/**
 * @desc    Get all toppers (Public access only to toppers)
 * @route   GET /api/students/toppers
 * @access  Public
 */
export const getToppers = asyncHandler(async (req, res) => {
  // force isTopper to true
  req.query.isTopper = "true";
  const result = await studentService.getAll(req.query);

  res.status(200).json(ApiResponse.success(result, "Toppers fetched successfully."));
});

/**
 * @desc    Get a single student by ID
 * @route   GET /api/students/:id
 * @access  Private (SUPER_ADMIN)
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const student = await studentService.getById(req.params.id);

  res.status(200).json(ApiResponse.success(student, "Student fetched successfully."));
});

/**
 * @desc    Update a student
 * @route   PUT /api/students/:id
 * @access  Private (SUPER_ADMIN)
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.update(req.params.id, req.body, req.file);

  res.status(200).json(ApiResponse.success(student, "Student updated successfully."));
});

/**
 * @desc    Delete a student
 * @route   DELETE /api/students/:id
 * @access  Private (SUPER_ADMIN)
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const result = await studentService.delete(req.params.id);

  res.status(200).json(ApiResponse.success(result, "Student deleted successfully."));
});
