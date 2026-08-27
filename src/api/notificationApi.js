import axiosInstance from "./axiosConfig";

export const notificationApi = {
  getAll: (params) => {
    return axiosInstance.get("/notifications/", { params });
  },

  markAsRead: (id) => {
    return axiosInstance.put(`/notifications/${id}/read/`);
  },

  markAllAsRead: () => {
    return axiosInstance.put("/notifications/read-all/");
  },

  getUnreadCount: () => {
    return axiosInstance.get("/notifications/unread-count/");
  },

  getPreferences: () => {
    return axiosInstance.get("/notifications/preferences/");
  },

  updatePreferences: (data) => {
    return axiosInstance.put("/notifications/preferences/", data);
  },
};
