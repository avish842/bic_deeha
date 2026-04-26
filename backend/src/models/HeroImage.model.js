import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    publicId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    targetAudience: {
      type: String,
      enum: ["BOTH", "DESKTOP", "MOBILE"],
      default: "BOTH",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroImage = mongoose.model("HeroImage", heroImageSchema);

export default HeroImage;
