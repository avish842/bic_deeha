import api from "./api";

const studentApi = {
  getToppers: () => api.get("/students/toppers"),
  getAll: (params) => api.get("/students", { params }),
  getById: (id) => api.get(`/students/${id}`),
  searchByRollNumber: (rollNumber) => api.get(`/students/search/${rollNumber}`),
  create: (formData) =>
    api.post("/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/students/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/students/${id}`),
};

export default studentApi;
