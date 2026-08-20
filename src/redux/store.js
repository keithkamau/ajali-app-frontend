import { configureStore } from "@reduxjs/toolkit";
import incidentReducer from "./slices/incidentSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    incidents: incidentReducer,
    notifications: notificationReducer,
  },
});
