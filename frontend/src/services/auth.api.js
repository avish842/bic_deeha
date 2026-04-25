import api from "./api";

const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/me"),
};

export default authApi;
