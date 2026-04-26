const CLOUDINARY_UPLOAD_MARKER = "/upload/";

export const isCloudinaryUrl = (url = "") =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes(CLOUDINARY_UPLOAD_MARKER);

export const optimizeCloudinaryImage = (
  url,
  {
    width = 1600,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = {}
) => {
  if (!isCloudinaryUrl(url)) return url;

  const transformation = [
    `f_${format}`,
    `q_${quality}`,
    "dpr_auto",
    height ? `h_${height}` : null,
    `w_${width}`,
    `c_${crop}`,
    `g_${gravity}`,
  ]
    .filter(Boolean)
    .join(",");

  return url.replace(CLOUDINARY_UPLOAD_MARKER, `${CLOUDINARY_UPLOAD_MARKER}${transformation}/`);
};

export const buildHeroSrcSet = (url, widths = [640, 960, 1280, 1600, 1920]) => {
  if (!isCloudinaryUrl(url)) return undefined;

  return widths
    .map((w) => `${optimizeCloudinaryImage(url, { width: w, height: Math.round(w * 0.56) })} ${w}w`)
    .join(", ");
};
