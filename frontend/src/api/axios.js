import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

if (import.meta.env.DEV) {
  console.log("Laravel API base URL:", apiBaseUrl);
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
