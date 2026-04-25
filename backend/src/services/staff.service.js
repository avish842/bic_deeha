import Staff from "../models/Staff.model.js";
import ApiError from "../utils/ApiError.js";
import { v2 as cloudinary } from "cloudinary";

class StaffService {
  async createStaff(data) {
    const staff = await Staff.create(data);
    return staff;
  }

  async getAllStaff(query) {
    const { page = 1, limit = 50, search } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { subjects: { $regex: search, $options: "i" } }
      ];
    }

    const [staff, total] = await Promise.all([
      Staff.find(filter).sort({ experience: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Staff.countDocuments(filter),
    ]);

    return { staff, total, page: Number(page), limit: Number(limit) };
  }

  async getStaffById(id) {
    const staff = await Staff.findById(id);
    if (!staff) throw ApiError.notFound("Staff member not found");
    return staff;
  }

  async updateStaff(id, data) {
    const staff = await this.getStaffById(id);
    const updatedStaff = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return updatedStaff;
  }

  async deleteStaff(id) {
    const staff = await this.getStaffById(id);
    if (staff.image?.publicId) {
      await cloudinary.uploader.destroy(staff.image.publicId).catch(() => {});
    }
    await staff.deleteOne();
    return true;
  }
}

export default new StaffService();
