import axiosInstance from "./axiosConfig";

export const incidentApi = {
  getAll: (params) => {
    return axiosInstance.get("/incidents/", { params });
  },

  getPublic: (params) => {
    return axiosInstance.get("/incidents/public/", { params });
  },

  getById: (id) => {
    return axiosInstance.get(`/incidents/${id}/`);
  },

  create: (data) => {
    return axiosInstance.post("/incidents/", data);
  },

  update: (id, data) => {
    return axiosInstance.put(`/incidents/${id}/`, data);
  },

  delete: (id) => {
    return axiosInstance.delete(`/incidents/${id}/`);
  },

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return axiosInstance.post(`/incidents/${id}/images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

<<<<<<< HEAD
// Admin endpoints
export const updateIncidentStatus = (id, payload) =>
  apiClient.put(`/admin/incidents/${id}/status`, payload).then(unwrap);
// Geocoding is proxied through our own backend (which uses OpenStreetMap/
// Nominatim server-side) rather than calling Nominatim directly from the browser.
export const reverseGeocode = (lat, lng) =>
  apiClient.get("/incidents/geocode/reverse", { params: { lat, lng } }).then(unwrap);

export const forwardGeocode = (address) =>
  apiClient.get("/incidents/geocode/forward", { params: { address } }).then(unwrap);
=======
  uploadVideo: (id, file) => {
    const formData = new FormData();
    formData.append("video", file);
    return axiosInstance.post(`/incidents/${id}/videos/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getStatusHistory: (id) => {
    return axiosInstance.get(`/incidents/${id}/status-history/`);
  },
};
>>>>>>> d9755c6 (feat: add API integration layer with axios)
