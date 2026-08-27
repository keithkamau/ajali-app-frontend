import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/*
| INCIDENTS
*/

export const getAdminIncidents = async (params = {}) => {
  const response = await axios.get(
    `${API_URL}/incidents/`,
    {
      ...getAuthHeaders(),
      params,
    }
  );

  return response.data;
};

export const getAdminIncident = async (id) => {
  const response = await axios.get(
    `${API_URL}/incidents/${id}/`,
    getAuthHeaders()
  );

  return response.data;
};

export const getRecentIncidents = async () => {
  const response = await axios.get(
    `${API_URL}/incidents/recent/`,
    getAuthHeaders()
  );

  return response.data;
};

/*
| STATISTICS
*/

export const getAdminStats = async () => {
  const response = await axios.get(
    `${API_URL}/incidents/stats/`,
    getAuthHeaders()
  );

  return response.data;
};

/*
| STATUS
*/

export const updateIncidentStatus = async (
  id,
  status,
  comment = ""
) => {
  const response = await axios.put(
    `${API_URL}/incidents/${id}/status/`,
    {
      status,
      comment,
    },
    getAuthHeaders()
  );

  return response.data;
};

export const bulkUpdateIncidentStatus = async (
  ids,
  status,
  comment = ""
) => {
  const response = await axios.put(
    `${API_URL}/incidents/bulk-status/`,
    {
      ids,
      status,
      comment,
    },
    getAuthHeaders()
  );

  return response.data;
};

/*
| STATUS HISTORY
*/

export const getIncidentStatusHistory = async (id) => {
  const response = await axios.get(
    `${API_URL}/incidents/${id}/status-history/`,
    getAuthHeaders()
  );

  return response.data;
};