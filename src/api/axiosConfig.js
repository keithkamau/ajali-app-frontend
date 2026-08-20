// src/api/axiosConfig.js
import axios from "axios";
import { AUTH_CONSTANTS } from "../utils/constants";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip auth header for mock mode
    if (USE_MOCK) {
      return config;
    }

    const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip token refresh for mock mode
    if (USE_MOCK) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(
          AUTH_CONSTANTS.REFRESH_TOKEN_KEY,
        );
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );

        const { access_token } = response.data;
        localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, access_token);

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
