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
};
