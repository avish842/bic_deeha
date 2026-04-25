import api from "./api";

const noticeApi = {
  getAll: (params) => api.get("/notices", { params }),
  getById: (id) => api.get(`/notices/${id}`),
  create: (formData) =>
    api.post("/notices", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/notices/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/notices/${id}`),
};

export default noticeApi;
