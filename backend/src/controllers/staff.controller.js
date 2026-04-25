import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import staffService from "../services/staff.service.js";
import { v2 as cloudinary } from "cloudinary";

export const createStaff = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.subjects && typeof data.subjects === "string") {
    data.subjects = data.subjects.split(",").map((s) => s.trim()).filter(Boolean);
  }
  
  if (req.file) {
    data.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const staff = await staffService.createStaff(data);
  res.status(201).json(ApiResponse.created(staff, "Staff added successfully"));
});

export const getStaffMembers = asyncHandler(async (req, res) => {
  const result = await staffService.getAllStaff(req.query);
  res.status(200).json(ApiResponse.success(result));
});

export const getStaffById = asyncHandler(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.id);
  res.status(200).json(ApiResponse.success(staff));
});

export const updateStaff = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.subjects && typeof data.subjects === "string") {
    data.subjects = data.subjects.split(",").map((s) => s.trim()).filter(Boolean);
  }

  if (req.file) {
    const existing = await staffService.getStaffById(req.params.id);
    if (existing.image?.publicId) {
      await cloudinary.uploader.destroy(existing.image.publicId).catch(() => {});
    }
    data.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const staff = await staffService.updateStaff(req.params.id, data);
  res.status(200).json(ApiResponse.success(staff, "Staff updated successfully"));
});

export const deleteStaff = asyncHandler(async (req, res) => {
  await staffService.deleteStaff(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Staff deleted successfully"));
});
