import api from "./api";

const galleryApi = {
  getAll: (params) => api.get("/gallery", { params }),
  getByCategory: (slug) => api.get(`/gallery/category/${slug}`),
  create: (formData) =>
    api.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/gallery/${id}`),

  // Categories
  getCategories: () => api.get("/gallery/categories"),
  createCategory: (data) => api.post("/gallery/categories", data),
  deleteCategory: (id) => api.delete(`/gallery/categories/${id}`),
};

export default galleryApi;
