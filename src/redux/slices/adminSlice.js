import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../api/adminApi";

const initialState = {
  incidents: [],
  stats: {
    total: 0,
    pending: 0,
    under_investigation: 0,
    resolved: 0,
    rejected: 0,
  },
  isLoading: false,
  error: null,
};

export const fetchAllIncidents = createAsyncThunk(
  "admin/fetchAllIncidents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAllIncidents();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateIncidentStatus = createAsyncThunk(
  "admin/updateStatus",
  async ({ id, status, comment }, { rejectWithValue }) => {
    try {
      const response = await adminApi.updateStatus(id, { status, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents = action.payload.results || [];
        // Calculate stats
        const incidents = state.incidents;
        state.stats = {
          total: incidents.length,
          pending: incidents.filter((i) => i.status === "pending").length,
          under_investigation: incidents.filter(
            (i) => i.status === "under_investigation",
          ).length,
          resolved: incidents.filter((i) => i.status === "resolved").length,
          rejected: incidents.filter((i) => i.status === "rejected").length,
        };
        state.error = null;
      })
      .addCase(fetchAllIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.incidents.findIndex((i) => i.id === updated.id);
        if (index !== -1) {
          state.incidents[index] = updated;
        }
        // Recalculate stats
        const incidents = state.incidents;
        state.stats = {
          total: incidents.length,
          pending: incidents.filter((i) => i.status === "pending").length,
          under_investigation: incidents.filter(
            (i) => i.status === "under_investigation",
          ).length,
          resolved: incidents.filter((i) => i.status === "resolved").length,
          rejected: incidents.filter((i) => i.status === "rejected").length,
        };
        state.error = null;
      })
      .addCase(updateIncidentStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
