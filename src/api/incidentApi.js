import apiClient from "./axiosConfig";

const unwrap = (response) => response.data;

export const listIncidents = (params = {}) =>
	apiClient.get("/incidents", { params }).then(unwrap);

export const getPublicIncidents = (params = {}) =>
	apiClient.get("/incidents/public", { params }).then(unwrap);

export const getIncident = (id) => apiClient.get(`/incidents/${id}`).then(unwrap);

export const createIncident = (payload) =>
	apiClient.post("/incidents", payload).then(unwrap);

export const updateIncident = (id, payload) =>
	apiClient.put(`/incidents/${id}`, payload).then(unwrap);

export const deleteIncident = (id) => apiClient.delete(`/incidents/${id}`).then(unwrap);

export const getStatusHistory = (id) =>
	apiClient.get(`/incidents/${id}/status-history`).then(unwrap);

export const uploadIncidentMedia = (id, mediaType, file) => {
	const formData = new FormData();
	formData.append(mediaType, file);
	return apiClient.post(`/incidents/${id}/${mediaType}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	}).then(unwrap);
};
