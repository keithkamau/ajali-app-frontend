// src/utils/constants.js

export const AUTH_CONSTANTS = {
  TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  USER_KEY: "user",
};

export const STATUS = {
  PENDING: "pending",
  UNDER_INVESTIGATION: "under_investigation",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export const STATUS_LABELS = {
  [STATUS.PENDING]: "Pending",
  [STATUS.UNDER_INVESTIGATION]: "Under Investigation",
  [STATUS.RESOLVED]: "Resolved",
  [STATUS.REJECTED]: "Rejected",
};

export const STATUS_COLORS = {
  [STATUS.PENDING]: "amber",
  [STATUS.UNDER_INVESTIGATION]: "red",
  [STATUS.RESOLVED]: "green",
  [STATUS.REJECTED]: "muted",
};

export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  CREATE_INCIDENT: "/incidents/create",
  INCIDENT_DETAIL: "/incidents/:id",
  ACTIVITY: "/activity",
  NOTIFICATIONS: "/notifications",
  ADMIN: "/admin",
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    UPDATE_PROFILE: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    DEACTIVATE: "/auth/deactivate",
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
};
