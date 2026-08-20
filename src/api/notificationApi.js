import apiClient from "./axiosConfig";

const unwrap = (res) => res.data;

export const getNotifications = (params = {}) =>
  apiClient.get("/notifications/", { params }).then(unwrap);

export const getUnreadCount = () =>
  apiClient.get("/notifications/unread-count").then(unwrap);

export const markAsRead = (id) =>
  apiClient.put(`/notifications/${id}/read`).then(unwrap);

export const markAllAsRead = () =>
  apiClient.put("/notifications/read-all").then(unwrap);

export const getPreferences = () =>
  apiClient.get("/notifications/preferences").then(unwrap);

export const updatePreferences = (payload) =>
  apiClient.put("/notifications/preferences", payload).then(unwrap);

export const sendTestEmail = () =>
  apiClient.post("/notifications/test-email").then(unwrap);

export const sendTestSms = () =>
  apiClient.post("/notifications/test-sms").then(unwrap);

export const deleteNotification = (id) =>
  apiClient.delete(`/notifications/${id}`).then(unwrap);

export const deleteAllNotifications = () =>
  apiClient.delete("/notifications/all").then(unwrap);
