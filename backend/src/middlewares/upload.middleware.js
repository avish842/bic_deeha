import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";
import appConfig from "../config/app.config.js";
import { CLOUDINARY_FOLDERS } from "../constants/index.js";

/**
 * Creates a multer upload middleware configured for a specific Cloudinary folder.
 * @param {string} folder - Cloudinary folder path
 * @param {number} maxCount - Max number of files (default 1)
 */
const createUploader = (folder, maxCount = 1) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "pdf", "doc", "docx"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: appConfig.UPLOAD.MAX_FILE_SIZE,
    },
  });

  if (maxCount === 1) {
    return upload.single("file");
  }

  return upload.array("files", maxCount);
};

// Pre-configured uploaders for each module
export const uploadHeroImage = createUploader(CLOUDINARY_FOLDERS.HERO || "bicdeeha/hero", 1);
export const uploadNoticeFile = createUploader(CLOUDINARY_FOLDERS.NOTICES, 1);
export const uploadGalleryImages = createUploader(CLOUDINARY_FOLDERS.GALLERY, 10);
export const uploadAchievementImage = createUploader(CLOUDINARY_FOLDERS.ACHIEVEMENTS, 1);
export const uploadStudentImage = createUploader(CLOUDINARY_FOLDERS.STUDENTS, 1);
export const uploadStaffImage = createUploader(CLOUDINARY_FOLDERS.STAFF, 1);

export default createUploader;
