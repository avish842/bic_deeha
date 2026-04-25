import mongoose from "mongoose";
import { ACHIEVEMENT_TYPE } from "../constants/index.js";

const achievementSchema = new mongoose.Schema(
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
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    type: {
      type: String,
      enum: Object.values(ACHIEVEMENT_TYPE),
      required: [true, "Achievement type is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ type: 1, date: -1 });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
