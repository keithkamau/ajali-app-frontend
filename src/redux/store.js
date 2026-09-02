import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import incidentReducer from "./slices/incidentSlice";
import notificationReducer from "./slices/notificationSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentReducer,
    notifications: notificationReducer,
    admin: adminReducer,
  },
});

export default store;
