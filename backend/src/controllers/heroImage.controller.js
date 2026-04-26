import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import heroService from "../services/hero.service.js";

export const addHeroImage = asyncHandler(async (req, res) => {
    const image = await heroService.addImage(req.file, req.body?.targetAudience);
    res.status(201).json(ApiResponse.created(image, "Hero image added successfully."));
});

export const getActiveHeroImages = asyncHandler(async (req, res) => {
    const images = await heroService.getAllImages();
    res.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(ApiResponse.success(images, "Active hero images fetched successfully."));
});

export const getAllHeroImagesAdmin = asyncHandler(async (req, res) => {
    const images = await heroService.getAllForAdmin();
    res.status(200).json(ApiResponse.success(images, "All hero images fetched successfully."));
});

export const toggleHeroImageStatus = asyncHandler(async (req, res) => {
    const image = await heroService.toggleActive(req.params.id);
    res.status(200).json(ApiResponse.success(image, "Hero image status toggled successfully."));
});

export const updateHeroImageOrder = asyncHandler(async (req, res) => {
    const image = await heroService.updateOrder(req.params.id, req.body?.order);
    res.status(200).json(ApiResponse.success(image, "Hero image order updated successfully."));
});

export const updateHeroImageTargetAudience = asyncHandler(async (req, res) => {
    const image = await heroService.updateTargetAudience(req.params.id, req.body?.targetAudience);
    res.status(200).json(ApiResponse.success(image, "Hero image target audience updated successfully."));
});

export const deleteHeroImage = asyncHandler(async (req, res) => {
    const result = await heroService.deleteImage(req.params.id);
    res.status(200).json(ApiResponse.success(null, result.message));
});

