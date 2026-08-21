import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as incidentApi from "../../api/incidentApi";

// Async thunks
export const fetchIncidents = createAsyncThunk(
  "incidents/fetchIncidents",
  async (params, { rejectWithValue }) => {
    try {
      const response = await incidentApi.listIncidents(params);
      return response.incidents || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch incidents",
      );
    }
  },
);

export const fetchIncidentById = createAsyncThunk(
  "incidents/fetchIncidentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getIncident(id);
      return response.incident;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Incident not found",
      );
    }
  },
);

export const createIncident = createAsyncThunk(
  "incidents/createIncident",
  async (data, { rejectWithValue }) => {
    try {
      const response = await incidentApi.createIncident(data);
      return response.incident;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create incident",
      );
    }
  },
);

export const updateIncident = createAsyncThunk(
  "incidents/updateIncident",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.updateIncident(id, data);
      return response.incident;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update incident",
      );
    }
  },
);

export const deleteIncident = createAsyncThunk(
  "incidents/deleteIncident",
  async (id, { rejectWithValue }) => {
    try {
      await incidentApi.deleteIncident(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete incident",
      );
    }
  },
);

export const fetchStatusHistory = createAsyncThunk(
  "incidents/fetchStatusHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getStatusHistory(id);
      return response.history || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch status history",
      );
    }
  },
);

export const uploadMedia = createAsyncThunk(
  "incidents/uploadMedia",
  async ({ id, mediaType, file }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.uploadIncidentMedia(
        id,
        mediaType,
        file,
      );
      return response.media;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to upload media",
      );
    }
  },
);

export const updateIncidentStatus = createAsyncThunk(
  "incidents/updateIncidentStatus",
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.updateIncidentStatus(id, {
        status,
        comment,
      });
      return response.incident;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update status",
      );
    }
  },
);

const initialState = {
  items: [],
  currentIncident: null,
  statusHistory: [],
  loading: false,
  error: null,
  success: null,
  uploading: false,
};

const incidentSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentIncident: (state, action) => {
      state.currentIncident = action.payload;
    },
    clearStatusHistory: (state) => {
      state.statusHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch incident by id
      .addCase(fetchIncidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIncident = action.payload;
      })
      .addCase(fetchIncidentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create incident
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.currentIncident = action.payload;
        state.success = "Incident reported successfully!";
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update incident
      .addCase(updateIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.currentIncident = action.payload;
        state.success = "Incident updated successfully!";
      })
      .addCase(updateIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete incident
      .addCase(deleteIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentIncident?.id === action.payload) {
          state.currentIncident = null;
        }
        state.success = "Incident deleted successfully!";
      })
      .addCase(deleteIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch status history
      .addCase(fetchStatusHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.statusHistory = action.payload;
      })
      .addCase(fetchStatusHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload media
      .addCase(uploadMedia.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.currentIncident) {
          const mediaType =
            action.payload.media_type === "image" ? "images" : "videos";
          if (!state.currentIncident[mediaType]) {
            state.currentIncident[mediaType] = [];
          }
          state.currentIncident[mediaType].push(action.payload.url);
        }
        state.success = "Media uploaded successfully!";
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // Update incident status
      .addCase(updateIncidentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = {
            ...state.currentIncident,
            ...action.payload,
          };
        }
        state.success = "Status updated successfully!";
      })
      .addCase(updateIncidentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setCurrentIncident,
  clearStatusHistory,
} = incidentSlice.actions;
export default incidentSlice.reducer;
