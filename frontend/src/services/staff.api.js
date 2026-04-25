import api from "./api";

const staffApi = {
  getAll: (params) => api.get("/staff", { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post("/staff", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, data) => api.put(`/staff/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`/staff/${id}`),
};

export default staffApi;
