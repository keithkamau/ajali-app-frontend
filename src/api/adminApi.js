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
    return axiosInstance.get("/auth/users/");
  },

  updateUserRole: (userId, data) => {
    return axiosInstance.put(`/auth/users/${userId}/`, data);
  },

  deleteUser: (userId) => {
    return axiosInstance.delete(`/auth/users/${userId}/`);
  },
};
