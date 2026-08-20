import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incidents: [],
  currentIncident: null,

  stats: {
    total: 0,
    resolved: 0,
    inProgress: 0,
    critical: 0,
  },

  users: [],

  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    /* INCIDENTS*/

    setIncidents: (state, action) => {
      state.incidents = action.payload;
    },

    setCurrentIncident: (state, action) => {
      state.currentIncident = action.payload;
    },

    updateIncidentStatus: (state, action) => {
      const { id, status } = action.payload;

      const incident = state.incidents.find(
        (incident) => incident.id === id
      );

      if (incident) {
        incident.status = status;
      }

      if (
        state.currentIncident &&
        state.currentIncident.id === id
      ) {
        state.currentIncident.status = status;
      }
    },

    bulkUpdateIncidentStatus: (state, action) => {
      const { ids, status } = action.payload;

      state.incidents = state.incidents.map(
        (incident) =>
          ids.includes(incident.id)
            ? { ...incident, status }
            : incident
      );
    },

    /* STATISTICS*/

    setStats: (state, action) => {
      state.stats = action.payload;
    },

    /* USERS*/

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    updateUserRole: (state, action) => {
      const { id, role } = action.payload;

      const user = state.users.find(
        (user) => user.id === id
      );

      if (user) {
        user.role = role;
      }
    },

    removeUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user.id !== action.payload
      );
    },

    /* LOADING / ERROR*/

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setIncidents,
  setCurrentIncident,
  updateIncidentStatus,
  bulkUpdateIncidentStatus,
  setStats,
  setUsers,
  updateUserRole,
  removeUser,
  setLoading,
  setError,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;