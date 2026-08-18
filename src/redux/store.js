import { configureStore } from "@reduxjs/toolkit";
import incidentReducer from "./slices/incidentSlice";

export const store = configureStore({ reducer: { incidents: incidentReducer } });
