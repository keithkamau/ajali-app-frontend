import axiosInstance from './axiosConfig';

export const notificationApi = {
    // Get all notifications with pagination
    getNotifications: (params = {}) => {
        return axiosInstance.get('/notifications/', { params });
    },
    
    // Get unread notification count
    getUnreadCount: () => {
        return axiosInstance.get('/notifications/unread-count/');
    },
    
    // Mark a single notification as read
    markAsRead: (id) => {
        return axiosInstance.put(`/notifications/${id}/read/`);
    },
    
    // Mark all notifications as read
    markAllAsRead: () => {
        return axiosInstance.put('/notifications/read-all/');
    },
    
    // Get notification preferences
    getPreferences: () => {
        return axiosInstance.get('/notifications/preferences/');
    },
    
    // Update notification preferences
    updatePreferences: (data) => {
        return axiosInstance.put('/notifications/preferences/', data);
    },
    
    // Delete a single notification
    deleteNotification: (id) => {
        return axiosInstance.delete(`/notifications/${id}/`);
    },
    
    // Delete all notifications
    deleteAllNotifications: () => {
        return axiosInstance.delete('/notifications/all/');
    },
};