import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { incidentApi } from "../../api/incidentApi";

const initialState = {
  incidents: [],
  currentIncident: null,
  publicIncidents: [],
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    totalPages: 1,
  },
};

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

const incidentSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentIncident: (state) => {
      state.currentIncident = null;
    },
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
      .addCase(fetchPublicIncidents.fulfilled, (state, action) => {
        state.publicIncidents = action.payload.results || [];
      })
      // Fetch Incident By ID
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.currentIncident = action.payload;
        state.error = null;
      })
      // Create Incident
      .addCase(createIncident.fulfilled, (state, action) => {
        state.incidents.unshift(action.payload);
        state.error = null;
      })
      // Update Incident
      .addCase(updateIncident.fulfilled, (state, action) => {
        const index = state.incidents.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
        if (state.currentIncident?.id === action.payload.id) {
          state.currentIncident = action.payload;
        }
        state.error = null;
      })
      // Delete Incident
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.incidents = state.incidents.filter(
          (i) => i.id !== action.payload,
        );
        if (state.currentIncident?.id === action.payload) {
          state.currentIncident = null;
        }
        state.error = null;
      });
  },
});

export const { clearError, clearCurrentIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
