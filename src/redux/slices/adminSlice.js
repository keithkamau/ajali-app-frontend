import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getAdminIncidents,
  getAdminIncident,
  getAdminStats,
  getRecentIncidents,
  updateIncidentStatus,
  bulkUpdateIncidentStatus,
  getIncidentStatusHistory,
} from "../../api/admin_api";

/*
| FETCH ALL INCIDENTS
*/

export const fetchAdminIncidents = createAsyncThunk(
  "admin/fetchAdminIncidents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getAdminIncidents(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to load incidents"
      );
    }
  }
);

/*
| FETCH SINGLE INCIDENT
*/

export const fetchAdminIncident = createAsyncThunk(
  "admin/fetchAdminIncident",
  async (id, { rejectWithValue }) => {
    try {
      return await getAdminIncident(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to load incident"
      );
    }
  }
);

/*
| FETCH STATISTICS
*/

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to load statistics"
      );
    }
  }
);

/*
| FETCH RECENT INCIDENTS
*/

export const fetchRecentIncidents = createAsyncThunk(
  "admin/fetchRecentIncidents",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecentIncidents();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to load recent incidents"
      );
    }
  }
);

/*
| UPDATE INCIDENT STATUS
*/

export const changeIncidentStatus = createAsyncThunk(
  "admin/changeIncidentStatus",
  async (
    { id, status, comment = "" },
    { rejectWithValue }
  ) => {
    try {
      return await updateIncidentStatus(
        id,
        status,
        comment
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to update incident status"
      );
    }
  }
);

/*
| BULK STATUS UPDATE
*/

export const changeBulkIncidentStatus = createAsyncThunk(
  "admin/changeBulkIncidentStatus",
  async (
    { ids, status, comment = "" },
    { rejectWithValue }
  ) => {
    try {
      return await bulkUpdateIncidentStatus(
        ids,
        status,
        comment
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to update incidents"
      );
    }
  }
);

/*
| FETCH STATUS HISTORY
*/

export const fetchIncidentStatusHistory = createAsyncThunk(
  "admin/fetchIncidentStatusHistory",
  async (id, { rejectWithValue }) => {
    try {
      return await getIncidentStatusHistory(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        "Failed to load status history"
      );
    }
  }
);

/*
| INITIAL STATE
*/

const initialState = {
  incidents: [],
  currentIncident: null,

  stats: {
    total: 0,
    reported: 0,
    under_review: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  },

  recentIncidents: [],
  statusHistory: [],
  loading: false,
  error: null,
};

/*
| SLICE
*/

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setCurrentIncident: (state, action) => {
      state.currentIncident = action.payload;
    },

    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    },

    clearStatusHistory: (state) => {
      state.statusHistory = [];
    },
  },

  extraReducers: (builder) => {
    /*    
    | INCIDENTS
    */

    builder
      .addCase(fetchAdminIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminIncidents.fulfilled, (state, action) => {
        state.loading = false;

        state.incidents =
          action.payload.results ||
          action.payload;
      })

      .addCase(fetchAdminIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /*
    | SINGLE INCIDENT    
    */

    builder
      .addCase(fetchAdminIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIncident = action.payload;
      })

      .addCase(fetchAdminIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /*
    | STATISTICS
    */

    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    /*
    | RECENT INCIDENTS
    */

    builder
      .addCase(fetchRecentIncidents.fulfilled, (state, action) => {
        state.recentIncidents =
          action.payload.results ||
          action.payload;
      })

      .addCase(fetchRecentIncidents.rejected, (state, action) => {
        state.error = action.payload;
      });


    /*
    | STATUS UPDATE  
    */

    builder
      .addCase(changeIncidentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changeIncidentStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedIncident = action.payload;

        const index = state.incidents.findIndex(
          (incident) =>
            incident.id === updatedIncident.id
        );

        if (index !== -1) {
          state.incidents[index] = updatedIncident;
        }

        if (
          state.currentIncident?.id ===
          updatedIncident.id
        ) {
          state.currentIncident = updatedIncident;
        }
      })

      .addCase(changeIncidentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    /*
    | BULK STATUS UPDATE
    */

    builder
      .addCase(changeBulkIncidentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changeBulkIncidentStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedIncidents =
          action.payload.incidents || [];

        updatedIncidents.forEach((updatedIncident) => {
          const index = state.incidents.findIndex(
            (incident) =>
              incident.id === updatedIncident.id
          );

          if (index !== -1) {
            state.incidents[index] =
              updatedIncident;
          }
        });
      })

      .addCase(changeBulkIncidentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    /*
    
    | STATUS HISTORY
    
    */

    builder
      .addCase(fetchIncidentStatusHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchIncidentStatusHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.statusHistory =
          action.payload.results ||
          action.payload;
      })

      .addCase(fetchIncidentStatusHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  clearError,
  setCurrentIncident,
  clearCurrentIncident,
  clearStatusHistory,
} = adminSlice.actions;

export default adminSlice.reducer;