import axiosInstance from "./axiosConfig";

export const incidentApi = {
  // Get all incidents for the current user
  getAll: (params) => {
    return axiosInstance.get("/incidents/", { params });
  },

  // Get public incidents (for map)
  getPublic: (params) => {
    return axiosInstance.get("/incidents/public/", { params });
  },

  // Get single incident by ID
  getById: (id) => {
    return axiosInstance.get(`/incidents/${id}/`);
  },

  // Create a new incident
  create: (data) => {
    return axiosInstance.post("/incidents/", data);
  },

  // Update an incident
  update: (id, data) => {
    return axiosInstance.put(`/incidents/${id}/`, data);
  },

  // Delete an incident
  delete: (id) => {
    return axiosInstance.delete(`/incidents/${id}/`);
  },

  // Upload an image to an incident
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return axiosInstance.post(`/incidents/${id}/images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload a video to an incident
  uploadVideo: (id, file) => {
    const formData = new FormData();
    formData.append("video", file);
    return axiosInstance.post(`/incidents/${id}/videos/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get status history for an incident
  getStatusHistory: (id) => {
    return axiosInstance.get(`/incidents/${id}/status-history/`);
  },

  // Update incident status (admin only)
  updateStatus: (id, data) => {
    return axiosInstance.put(`/admin/incidents/${id}/status/`, data);
  },
};
