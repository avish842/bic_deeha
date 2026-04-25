import mongoose from "mongoose";
import { PRIORITY } from "../constants/index.js";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    file: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      fileName: { type: String, default: null },
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.NORMAL,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
noticeSchema.index({ isActive: 1, priority: 1, createdAt: -1 });
noticeSchema.index({ expiryDate: 1 });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
