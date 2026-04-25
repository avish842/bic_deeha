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
  },
  {
    timestamps: true,
  }
);

const HeroImage = mongoose.model("HeroImage", heroImageSchema);

export default HeroImage;
