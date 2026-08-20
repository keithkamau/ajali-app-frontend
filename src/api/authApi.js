// src/api/authApi.js
import axios from "./axiosConfig";

export const authApi = {
  // Register user
  register: async (userData) => {
    const response = await axios.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(
      "/auth/refresh",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post("/auth/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get("/auth/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await axios.put("/auth/me", data);
    return response.data;
  },

  // Change password
  changePassword: async (data) => {
    const response = await axios.post("/auth/change-password", data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axios.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await axios.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await axios.post("/auth/deactivate");
    return response.data;
  },
};
