// utils/axiosInstances/expressClient.ts
import axios from "axios";
import { getAuthToken, refreshAuthToken, logoutUser } from "@/utils/auth";

const expressClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL2, // ✅ Express server URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

expressClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log("token for login", token);
    // If token exists, set it in the Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

expressClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return expressClient(originalRequest);
        }
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default expressClient;
