import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const pathname = window.location.pathname;
    const isPublicPage = pathname.includes("/login") || 
                         pathname.includes("/checkin") || 
                         pathname.includes("/register");
                         
    // Only redirect on 401 if we're not on a public page and not trying to login
    if (
      error.response?.status === 401 &&
      !isPublicPage &&
      !error.config?.url?.includes("/auth/login")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
