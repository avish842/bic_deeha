import Student from "../models/Student.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";
import appConfig from "../config/app.config.js";

class StudentService {
  /**
   * Add a new student.
   */
  async create(data, file) {
    const existingStudent = await Student.findOne({ admissionNumber: data.admissionNumber?.toUpperCase() });

    if (existingStudent) {
      throw ApiError.badRequest("Student with this admission number already exists.");
    }

    const studentData = { ...data };

    if (file) {
      studentData.profileImage = {
        url: file.path,
        publicId: file.filename,
      };
    }

    const student = await Student.create(studentData);
    return student;
  }

  /**
   * Get all students with pagination.
   */
  async getAll(query = {}) {
    const {
      page = appConfig.PAGINATION.DEFAULT_PAGE,
      limit = appConfig.PAGINATION.DEFAULT_LIMIT,
      currentClass,
      stream,
      section,
      search,
      isTopper,
      passingYear,
    } = query;

    const filter = {};
    if (currentClass) filter.currentClass = parseInt(currentClass);
    if (stream) filter.stream = stream;
    if (section) filter.section = section;
    if (isTopper !== undefined) filter.isTopper = isTopper === "true";
    if (passingYear) filter.passingYear = parseInt(passingYear);

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { admissionNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = Math.min(parseInt(limit), appConfig.PAGINATION.MAX_LIMIT);

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Student.countDocuments(filter),
    ]);

    return {
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum,
      },
    };
  }

  /**
   * Search student by admission number.
   */
  async searchByRollNumber(admissionNumber) {
    const student = await Student.findOne({
      admissionNumber: admissionNumber.toUpperCase(),
    });

    if (!student) {
      throw ApiError.notFound("Student not found.");
    }

    return student;
  }

  /**
   * Get a single student by ID.
   */
  async getById(id) {
    const student = await Student.findById(id);
    if (!student) throw ApiError.notFound("Student not found.");
    return student;
  }

  /**
   * Update a student by ID.
   */
  async update(id, data, file) {
    const student = await Student.findById(id);
    if (!student) throw ApiError.notFound("Student not found.");

    if (file) {
      if (student.profileImage?.publicId) {
        await cloudinary.uploader.destroy(student.profileImage.publicId);
      }
      data.profileImage = {
        url: file.path,
        publicId: file.filename,
      };
    }

    const updated = await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  /**
   * Delete a student and their profile image from Cloudinary.
   */
  async delete(id) {
    const student = await Student.findById(id);
    if (!student) throw ApiError.notFound("Student not found.");

    if (student.profileImage?.publicId) {
      await cloudinary.uploader.destroy(student.profileImage.publicId);
    }

    await Student.findByIdAndDelete(id);

    return { message: "Student deleted successfully." };
  }
}

export default new StudentService();
