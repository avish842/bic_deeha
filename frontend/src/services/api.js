import axios from "axios";
import envConfig from "../config/env.config";

// Remove trailing slash safely before adding /api if not present
let baseUrl = envConfig.API_BASE_URL || "";
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1);
}
// If user already included /api in the env variable, don't add it twice
if (!baseUrl.endsWith('/api')) {
  baseUrl += '/api';
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor — attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
