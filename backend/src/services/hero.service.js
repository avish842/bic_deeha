import HeroImage from "../models/HeroImage.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";

class HeroService {
  async addImage(file) {
    if (!file) throw ApiError.badRequest("No image provided.");

    const heroImage = await HeroImage.create({
      imageUrl: file.path,
      publicId: file.filename,
    });
    return heroImage;
  }

  async getAllImages() {
    return await HeroImage.find({ isActive: true })
      .select("imageUrl createdAt")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAllForAdmin() {
    return await HeroImage.find().sort({ createdAt: -1 });
  }

  async toggleActive(id) {
    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    image.isActive = !image.isActive;
    await image.save();
    return image;
  }

  async deleteImage(id) {
    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
    await HeroImage.findByIdAndDelete(id);
    return { message: "Image deleted successfully." };
  }
}

export default new HeroService();
