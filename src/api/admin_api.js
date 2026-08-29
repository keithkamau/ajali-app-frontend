import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

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

/* 
   USERS
 */

export const getAdminUsers = async (params = {}) => {
  const response = await axios.get(
    `${API_URL}/users/`,
    {
      ...getAuthHeaders(),
      params,
    }
  );

  return response.data;
};

export const getAdminUser = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}/`,
    getAuthHeaders()
  );

  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await axios.put(
    `${API_URL}/users/${id}/role/`,
    {
      role,
    },
    getAuthHeaders()
  );

  return response.data;
};

export const updateUserStatus = async (
  id,
  isActive
) => {
  const response = await axios.put(
    `${API_URL}/users/${id}/`,
    {
      is_active: isActive,
    },
    getAuthHeaders()
  );

  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}/`,
    getAuthHeaders()
  );

  return response.data;
};

/* 
   SEARCH / FILTER
 */

export const searchAdminIncidents = async (query) => {
  const response = await axios.get(
    `${API_URL}/incidents/search/`,
    {
      ...getAuthHeaders(),
      params: {
        search: query,
      },
    }
  );

  return response.data;
};

export const filterAdminIncidents = async (filters = {}) => {
  const response = await axios.get(
    `${API_URL}/incidents/filter/`,
    {
      ...getAuthHeaders(),
      params: filters,
    }
  );
  return response.data;
};
