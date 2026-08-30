import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { incidentApi } from "../../api/incidentApi";

const initialState = {
  incidents: [],
  currentIncident: null,
  publicIncidents: [],
  isLoading: false,
  error: null,
  success: null,
  statusHistory: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    totalPages: 1,
  },
};

// Fetch user's incidents
export const fetchIncidents = createAsyncThunk(
  "incidents/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch public incidents (for map)
export const fetchPublicIncidents = createAsyncThunk(
  "incidents/fetchPublic",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getPublic(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch single incident by ID
export const fetchIncidentById = createAsyncThunk(
  "incidents/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Create new incident
export const createIncident = createAsyncThunk(
  "incidents/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await incidentApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update incident
export const updateIncident = createAsyncThunk(
  "incidents/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Delete incident
export const deleteIncident = createAsyncThunk(
  "incidents/delete",
  async (id, { rejectWithValue }) => {
    try {
      await incidentApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Upload image
export const uploadImage = createAsyncThunk(
  "incidents/uploadImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.uploadImage(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Upload video
export const uploadVideo = createAsyncThunk(
  "incidents/uploadVideo",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.uploadVideo(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch status history
export const fetchStatusHistory = createAsyncThunk(
  "incidents/fetchStatusHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await incidentApi.getStatusHistory(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update incident status (admin)
export const updateIncidentStatus = createAsyncThunk(
  "incidents/updateStatus",
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await incidentApi.updateStatus(id, { status, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

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
    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    },
    clearStatusHistory: (state) => {
      state.statusHistory = [];
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents = action.payload.results || [];
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
          page: action.payload.page || 1,
          totalPages: action.payload.total_pages || 1,
        };
        state.error = null;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Public Incidents
      .addCase(fetchPublicIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicIncidents = action.payload.results || [];
        state.error = null;
      })
      .addCase(fetchPublicIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Incident By ID
      .addCase(fetchIncidentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentIncident = action.payload;
        state.error = null;
      })
      .addCase(fetchIncidentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Incident
      .addCase(createIncident.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents.unshift(action.payload);
        state.success = "Incident created successfully";
        state.error = null;
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })

      // Update Incident
      .addCase(updateIncident.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.incidents.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = action.payload;
        }
        state.success = "Incident updated successfully";
        state.error = null;
      })
      .addCase(updateIncident.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })

      // Delete Incident
      .addCase(deleteIncident.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents = state.incidents.filter(
          (i) => i.id !== action.payload,
        );
        if (state.currentIncident?.id === action.payload) {
          state.currentIncident = null;
        }
        state.success = "Incident deleted successfully";
        state.error = null;
      })
      .addCase(deleteIncident.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentIncident) {
          if (!state.currentIncident.images) state.currentIncident.images = [];
          state.currentIncident.images.push(action.payload);
        }
        state.success = "Image uploaded successfully";
        state.error = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentIncident) {
          if (!state.currentIncident.videos) state.currentIncident.videos = [];
          state.currentIncident.videos.push(action.payload);
        }
        state.success = "Video uploaded successfully";
        state.error = null;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Status History
      .addCase(fetchStatusHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatusHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statusHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchStatusHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateIncidentStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentIncident) {
          state.currentIncident.status = action.payload.status;
        }
        const index = state.incidents.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.incidents[index].status = action.payload.status;
        }
        state.success = "Status updated successfully";
        state.error = null;
      })
      .addCase(updateIncidentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentIncident,
  clearStatusHistory,
  resetState,
} = incidentSlice.actions;

export default incidentSlice.reducer;
