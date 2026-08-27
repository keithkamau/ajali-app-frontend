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
