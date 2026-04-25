export const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
});

export const PRIORITY = Object.freeze({
  HIGH: "HIGH",
  NORMAL: "NORMAL",
});

export const ACHIEVEMENT_TYPE = Object.freeze({
  STUDENT: "STUDENT",
  COLLEGE: "COLLEGE",
});

export const STATUS_CODES = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
});

export const CLOUDINARY_FOLDERS = Object.freeze({
  HERO: "college-website/hero",
  NOTICES: "college-website/notices",
  GALLERY: "college-website/gallery",
  ACHIEVEMENTS: "college-website/achievements",
  STUDENTS: "college-website/students",
  STAFF: "college-website/staff",
});
