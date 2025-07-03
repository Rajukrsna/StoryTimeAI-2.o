// utils/axiosInstances/lambdaClient.ts
import axios from "axios";
import { getAuthToken, refreshAuthToken, logoutUser } from "@/utils/auth";

const lambdaClient = axios.create({
  baseURL: 'https://jn07w6w57c.execute-api.us-east-1.amazonaws.com/dev/api', 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

lambdaClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

lambdaClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return lambdaClient(originalRequest);
        }
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default lambdaClient;
