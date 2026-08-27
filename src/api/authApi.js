import axiosInstance from "./axiosConfig";

export const authApi = {
  register: (userData) => {
    return axiosInstance.post("/auth/register/", userData);
  },

  login: (credentials) => {
    return axiosInstance.post("/auth/login/", credentials);
  },

  logout: (refreshToken) => {
    return axiosInstance.post("/auth/logout/", { refresh_token: refreshToken });
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post("/auth/refresh/", { refresh: refreshToken });
  },

  getCurrentUser: () => {
    return axiosInstance.get("/auth/me/");
  },

  updateProfile: (userData) => {
    return axiosInstance.put("/auth/me/", userData);
  },

  changePassword: (data) => {
    return axiosInstance.post("/auth/change-password/", data);
  },

  forgotPassword: (email) => {
    return axiosInstance.post("/auth/forgot-password/", { email });
  },

  resetPassword: (token, newPassword) => {
    return axiosInstance.post("/auth/reset-password/", {
      token,
      new_password: newPassword,
    });
  },
};
