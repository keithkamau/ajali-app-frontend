import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as incidentApi from "../../api/incidentApi";

const getError = (error) => error.response?.data?.message || "Something went wrong. Please try again.";

export const fetchIncidents = createAsyncThunk("incidents/fetch", incidentApi.listIncidents);
export const fetchIncident = createAsyncThunk("incidents/fetchOne", incidentApi.getIncident);
export const addIncident = createAsyncThunk("incidents/add", incidentApi.createIncident);
export const editIncident = createAsyncThunk("incidents/edit", ({ id, payload }) => incidentApi.updateIncident(id, payload));
export const removeIncident = createAsyncThunk("incidents/remove", incidentApi.deleteIncident);

const initialState = { items: [], current: null, pagination: {}, loading: false, error: null };

const incidentSlice = createSlice({
	name: "incidents",
	initialState,
	reducers: { clearIncidentError: (state) => { state.error = null; }, clearCurrentIncident: (state) => { state.current = null; } },
	extraReducers: (builder) => {
		builder
			.addCase(fetchIncidents.pending, (state) => { state.loading = true; state.error = null; })
			.addCase(fetchIncidents.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.incidents || action.payload.data || action.payload || []; state.pagination = action.payload.pagination || {}; })
			.addCase(fetchIncidents.rejected, (state, action) => { state.loading = false; state.error = getError(action.error); })
			.addCase(fetchIncident.fulfilled, (state, action) => { state.current = action.payload.incident || action.payload.data || action.payload; })
			.addCase(addIncident.fulfilled, (state, action) => { state.items.unshift(action.payload.incident || action.payload.data || action.payload); })
			.addCase(editIncident.fulfilled, (state, action) => { const updated = action.payload.incident || action.payload.data || action.payload; state.current = updated; state.items = state.items.map((item) => item.id === updated.id ? updated : item); })
			.addCase(removeIncident.fulfilled, (state, action) => { state.items = state.items.filter((item) => item.id !== action.meta.arg); });
	},
});

export const { clearIncidentError, clearCurrentIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
