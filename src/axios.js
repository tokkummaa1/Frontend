import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: "https://backend-12wd.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `JWT ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const cache = new Map();

api.interceptors.request.use((config) => {
  if (config.method === "get" && cache.has(config.url)) {
    return Promise.resolve(cache.get(config.url));
  }
  return config;
});

export default api;
