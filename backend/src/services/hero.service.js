import HeroImage from "../models/HeroImage.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.config.js";

class HeroService {
  sanitizeTargetAudience(value) {
    const allowed = ["BOTH", "DESKTOP", "MOBILE"];
    const normalized = String(value || "BOTH").toUpperCase();
    return allowed.includes(normalized) ? normalized : "BOTH";
  }

  async normalizeOrders() {
    const images = await HeroImage.find()
      .select("_id order createdAt")
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const updates = [];
    for (let index = 0; index < images.length; index += 1) {
      const desiredOrder = index + 1;
      if (images[index].order !== desiredOrder) {
        updates.push({
          updateOne: {
            filter: { _id: images[index]._id },
            update: { $set: { order: desiredOrder } },
          },
        });
      }
    }

    if (updates.length > 0) {
      await HeroImage.bulkWrite(updates);
    }
  }

  async addImage(file, targetAudience) {
    if (!file) throw ApiError.badRequest("No image provided.");

    await this.normalizeOrders();
    const maxOrderDoc = await HeroImage.findOne().sort({ order: -1 }).select("order");
    const nextOrder = (maxOrderDoc?.order || 0) + 1;

    const heroImage = await HeroImage.create({
      imageUrl: file.path,
      publicId: file.filename,
      order: nextOrder,
      targetAudience: this.sanitizeTargetAudience(targetAudience),
    });
    return heroImage;
  }

  async getAllImages() {
    await this.normalizeOrders();
    return await HeroImage.find({ isActive: true })
      .select("imageUrl createdAt order targetAudience")
      .sort({ order: 1, createdAt: 1 })
      .lean();
  }

  async getAllForAdmin() {
    await this.normalizeOrders();
    return await HeroImage.find().sort({ order: 1, createdAt: 1 });
  }

  async updateOrder(id, requestedOrder) {
    await this.normalizeOrders();

    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    const total = await HeroImage.countDocuments();
    const targetOrder = Math.min(Math.max(Number(requestedOrder), 1), total);
    const currentOrder = image.order;

    if (Number.isNaN(targetOrder)) {
      throw ApiError.badRequest("Valid order is required.");
    }

    if (targetOrder === currentOrder) return image;

    if (targetOrder > currentOrder) {
      await HeroImage.updateMany(
        { order: { $gt: currentOrder, $lte: targetOrder } },
        { $inc: { order: -1 } }
      );
    } else {
      await HeroImage.updateMany(
        { order: { $gte: targetOrder, $lt: currentOrder } },
        { $inc: { order: 1 } }
      );
    }

    image.order = targetOrder;
    await image.save();
    return image;
  }

  async updateTargetAudience(id, targetAudience) {
    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    image.targetAudience = this.sanitizeTargetAudience(targetAudience);
    await image.save();
    return image;
  }

  async toggleActive(id) {
    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    image.isActive = !image.isActive;
    await image.save();
    return image;
  }

  async deleteImage(id) {
    await this.normalizeOrders();
    const image = await HeroImage.findById(id);
    if (!image) throw ApiError.notFound("Image not found.");

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
    await HeroImage.findByIdAndDelete(id);
    await this.normalizeOrders();
    return { message: "Image deleted successfully." };
  }
}

export default new HeroService();
