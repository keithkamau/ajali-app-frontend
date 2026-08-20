import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as notificationApi from "../../api/notificationApi";

const getError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  notificationApi.getNotifications
);
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnread",
  notificationApi.getUnreadCount
);
export const markAsRead = createAsyncThunk(
  "notifications/markRead",
  notificationApi.markAsRead
);
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllRead",
  notificationApi.markAllAsRead
);
export const fetchPreferences = createAsyncThunk(
  "notifications/fetchPrefs",
  notificationApi.getPreferences
);
export const updatePreferences = createAsyncThunk(
  "notifications/updatePrefs",
  notificationApi.updatePreferences
);
export const removeNotification = createAsyncThunk(
  "notifications/remove",
  notificationApi.deleteNotification
);
export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAll",
  notificationApi.deleteAllNotifications
);

const initialState = {
  notifications: [],
  unread_count: 0,
  preferences: { email_enabled: true, sms_enabled: true, push_enabled: false },
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = getError(action.error);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unread_count = action.payload.unread_count ?? 0;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updated = action.payload.notification;
        state.notifications = state.notifications.map((n) =>
          n.id === updated.id ? updated : n
        );
        state.unread_count = Math.max(0, state.unread_count - 1);
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unread_count = 0;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload.preferences || action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload.preferences || action.payload;
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const wasUnread = state.notifications.find((n) => n.id === id && !n.read);
        state.notifications = state.notifications.filter((n) => n.id !== id);
        if (wasUnread) state.unread_count = Math.max(0, state.unread_count - 1);
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unread_count = 0;
      });
  },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
