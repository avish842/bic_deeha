const appConfig = {
  APP_NAME: "BIC DEEHA",
  VERSION: "1.0.0",
  DESCRIPTION: "Production-grade College Website Management System",

  CONTACT: {
    EMAIL: "info@college.edu",
    PHONE: "+91-9876543210",
    ADDRESS: "123 College Road, City, State - 110001",
  },

  SOCIAL_LINKS: {
    FACEBOOK: "https://facebook.com/college",
    TWITTER: "https://twitter.com/college",
    INSTAGRAM: "https://instagram.com/college",
    YOUTUBE: "https://youtube.com/college",
    LINKEDIN: "https://linkedin.com/school/college",
  },

  FEATURE_FLAGS: {
    ENABLE_GALLERY: true,
    ENABLE_ACHIEVEMENTS: true,
    ENABLE_STUDENT_PORTAL: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_FILE_UPLOAD: true,
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ALLOWED_DOC_TYPES: ["application/pdf", "application/msword"],
    MAX_GALLERY_IMAGES: 10,
  },
};

export default appConfig;
