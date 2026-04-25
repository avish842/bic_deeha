import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required (e.g. Principal, PGT Teacher, TGT Teacher, Clerk)"],
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    subjects: {
      type: [String],
      default: [],
    },
    qualification: {
      type: String,
      trim: true,
      default: "NA",
    },
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
