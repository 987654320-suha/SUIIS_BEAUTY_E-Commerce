import axios from "axios";

// Standardized API Base URL for local development and Render production
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: automatically attach Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 & clear stale auth
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid / expired session tokens
      localStorage.removeItem("token");
      localStorage.removeItem("suiisUser");

      // Notify application state of unauthorized event
      window.dispatchEvent(new CustomEvent("suiis:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
