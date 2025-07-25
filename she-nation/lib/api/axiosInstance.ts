import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getAuthToken } from "@/lib/auth/auth-service";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get token from cookies on client side only
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
