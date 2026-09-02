import axiosInstance from "./axiosConfig";

export const adminApi = {
  getAllIncidents: () => {
    return axiosInstance.get("/admin/incidents/");
  },

  updateStatus: (id, data) => {
    return axiosInstance.put(`/admin/incidents/${id}/status/`, data);
  },

  getStats: () => {
    return axiosInstance.get("/admin/incidents/stats/");
  },

  getUsers: () => {
    return axiosInstance.get("/api/auth/users/");
  },

  updateUserRole: (userId, data) => {
    return axiosInstance.put(`/api/auth/users/${userId}/`, data);
  },

  deleteUser: (userId) => {
    return axiosInstance.delete(`/api/auth/users/${userId}/`);
  },
};
