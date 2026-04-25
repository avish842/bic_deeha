import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    admissionNumber: {
      type: String,
      required: [true, "Admission number (SR number) is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    currentClass: {
      type: Number,
      required: [true, "Class is required (6 to 12)"],
      min: [6, "Class must be at least 6"],
      max: [12, "Class cannot exceed 12"],
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
      default: "A",
    },
    stream: {
      type: String,
      enum: ["Science", "Arts", "Commerce", "Agriculture", "N/A"],
      default: "N/A",
      trim: true,
    },
    isTopper: {
      type: Boolean,
      default: false,
    },
    passingYear: {
      type: Number,
      // e.g. 2024, 2025
    },
    percentage: {
      type: Number,
      // e.g. 95.5
    },
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    profileImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ name: "text", admissionNumber: "text" });

const Student = mongoose.model("Student", studentSchema);

export default Student;
