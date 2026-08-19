// src/redux/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  theme: "light",
  loading: false,
  modal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openModal: (state, action) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  openModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;
