// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import { AUTH_CONSTANTS } from "../../utils/constants";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get user",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Profile update failed",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Password change failed",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Request failed");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Reset failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  },
);

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem(AUTH_CONSTANTS.USER_KEY)) || null,
  token: localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY),
  isLoading: false,
  error: null,
  success: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "Registration successful! Please log in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access_token;
        state.refreshToken = action.payload.tokens.refresh_token;
        state.success = "Login successful!";

        localStorage.setItem(
          AUTH_CONSTANTS.TOKEN_KEY,
          action.payload.tokens.access_token,
        );
        localStorage.setItem(
          AUTH_CONSTANTS.REFRESH_TOKEN_KEY,
          action.payload.tokens.refresh_token,
        );
        localStorage.setItem(
          AUTH_CONSTANTS.USER_KEY,
          JSON.stringify(action.payload.user),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem(
          AUTH_CONSTANTS.USER_KEY,
          JSON.stringify(action.payload.user),
        );
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.success = "Profile updated successfully!";
        localStorage.setItem(
          AUTH_CONSTANTS.USER_KEY,
          JSON.stringify(action.payload.user),
        );
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Password reset link sent to your email!";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Password reset successful! Please log in.";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.success = null;
        state.error = null;

        localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;

        localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
      });
  },
});

export const { clearError, clearSuccess, updateUser } = authSlice.actions;
export default authSlice.reducer;
