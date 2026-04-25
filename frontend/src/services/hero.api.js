import api from "./api";

const heroApi = {
  // Public
  getActive: () => api.get("/hero/active"),

  // Admin
  getAllAdmin: () => api.get("/hero/admin"),
  add: (formData) => api.post("/hero", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  toggleStatus: (id) => api.patch(`/hero/${id}/toggle`),
  delete: (id) => api.delete(`/hero/${id}`),
};

export default heroApi;
