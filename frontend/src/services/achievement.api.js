import api from "./api";

const achievementApi = {
  getAll: (params) => api.get("/achievements", { params }),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (formData) =>
    api.post("/achievements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/achievements/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/achievements/${id}`),
};

export default achievementApi;
