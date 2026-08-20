import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL: API_URL,
});

/* 
   AUTHORIZATION
 */

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* 
   INCIDENTS
 */

export const getAdminIncidents = (params = {}) =>
  adminApi.get("/admin/incidents", { params });

export const getAdminIncident = (id) =>
  adminApi.get(`/admin/incidents/${id}`);

export const updateIncidentStatus = (id, status, comment = "") =>
  adminApi.put(`/admin/incidents/${id}/status`, {
    status,
    comment,
  });

export const getIncidentStats = () =>
  adminApi.get("/admin/incidents/stats");

export const getRecentIncidents = () =>
  adminApi.get("/admin/incidents/recent");

export const searchAdminIncidents = (query) =>
  adminApi.get("/admin/incidents/search", {
    params: { q: query },
  });

export const filterAdminIncidents = (filters) =>
  adminApi.get("/admin/incidents/filter", {
    params: filters,
  });

export const getIncidentStatusHistory = (id) =>
  adminApi.get(
    `/admin/incidents/${id}/status-history`
  );

export const bulkUpdateIncidentStatus = (
  incidentIds,
  status
) =>
  adminApi.put("/admin/incidents/bulk-status", {
    incident_ids: incidentIds,
    status,
  });

/* 
   USERS
 */

export const getAdminUsers = (params = {}) =>
  adminApi.get("/admin/users", { params });

export const getAdminUser = (id) =>
  adminApi.get(`/admin/users/${id}`);

export const updateUserRole = (id, role) =>
  adminApi.put(`/admin/users/${id}/role`, {
    role,
  });

export const deleteUser = (id) =>
  adminApi.delete(`/admin/users/${id}`);

/* 
   EXPORT
 */

export const exportIncidents = (params = {}) =>
  adminApi.get("/admin/incidents/export", {
    params,
    responseType: "blob",
  });

export default adminApi;