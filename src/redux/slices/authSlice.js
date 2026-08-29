import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import { AUTH_CONSTANTS } from "../../utils/constants";

// Mock user data for testing
const MOCK_USERS = [
  {
    id: 1,
    email: "user@ajali.com",
    password: "Password123",
    full_name: "Test User",
    phone_number: "0712345678",
    role: "user",
    is_active: true,
    is_verified: true,
  },
  {
    id: 2,
    email: "admin@ajali.com",
    password: "Admin123",
    full_name: "Admin User",
    phone_number: "0712345679",
    role: "admin",
    is_active: true,
    is_verified: true,
  },
];

// Mock tokens
const MOCK_ACCESS_TOKEN = "mock-access-token-xyz123";
const MOCK_REFRESH_TOKEN = "mock-refresh-token-xyz456";

// Check if using mock mode
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "false" || false;

// Async thunks with mock support
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    if (USE_MOCK) {
      // Mock registration
      const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
      if (existingUser) {
        return rejectWithValue("User with this email already exists");
      }

      const newUser = {
        id: MOCK_USERS.length + 1,
        ...userData,
        password: userData.password,
        role: "user",
        is_active: true,
        is_verified: true,
      };
      MOCK_USERS.push(newUser);

      return {
        message: "Registration successful! Please log in.",
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          phone_number: newUser.phone_number,
          role: newUser.role,
          is_active: newUser.is_active,
          is_verified: newUser.is_verified,
        },
      };
    }

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
    if (USE_MOCK) {
      // Mock login
      const user = MOCK_USERS.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password,
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      const { password, ...userWithoutPassword } = user;

      return {
        message: "Login successful!",
        user: userWithoutPassword,
        tokens: {
          access_token: MOCK_ACCESS_TOKEN,
          refresh_token: MOCK_REFRESH_TOKEN,
          token_type: "bearer",
        },
      };
    }

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
    if (USE_MOCK) {
      // Get user from localStorage
      const userStr = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
      if (!userStr) {
        return rejectWithValue("No user found");
      }
      try {
        const user = JSON.parse(userStr);
        return { user };
      } catch {
        return rejectWithValue("Invalid user data");
      }
    }

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
    if (USE_MOCK) {
      // Update mock user
      const userStr = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
      if (!userStr) {
        return rejectWithValue("No user found");
      }

      try {
        const currentUser = JSON.parse(userStr);
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem(
          AUTH_CONSTANTS.USER_KEY,
          JSON.stringify(updatedUser),
        );
        return { user: updatedUser, message: "Profile updated successfully!" };
      } catch {
        return rejectWithValue("Failed to update profile");
      }
    }

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
    if (USE_MOCK) {
      // Mock password change
      const userStr = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
      if (!userStr) {
        return rejectWithValue("No user found");
      }

      const user = JSON.parse(userStr);
      const mockUser = MOCK_USERS.find((u) => u.id === user.id);

      if (!mockUser) {
        return rejectWithValue("User not found");
      }

      if (mockUser.password !== data.current_password) {
        return rejectWithValue("Current password is incorrect");
      }

      mockUser.password = data.new_password;
      return { message: "Password changed successfully!" };
    }

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
    if (USE_MOCK) {
      // Mock forgot password
      const user = MOCK_USERS.find((u) => u.email === email);
      if (!user) {
        // For security, don't reveal if user exists
        return {
          message:
            "If your email exists, you will receive a password reset link",
        };
      }
      return { message: "Password reset link sent to your email!" };
    }

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
    if (USE_MOCK) {
      // Mock reset password - find user by token (in mock, we just use any user)
      const user = MOCK_USERS[0];
      if (user) {
        user.password = newPassword;
        return { message: "Password reset successful!" };
      }
      return { message: "Password reset successful! Please log in." };
    }

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
    if (USE_MOCK) {
      return {};
    }

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
        state.success =
          action.payload.message || "Registration successful! Please log in.";
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

        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;

        state.success = action.payload.message || "Login successful!";

        localStorage.setItem(
          AUTH_CONSTANTS.TOKEN_KEY,
          action.payload.access_token,
        );

        localStorage.setItem(
          AUTH_CONSTANTS.REFRESH_TOKEN_KEY,
          action.payload.refresh_token,
        );

        localStorage.setItem(
          AUTH_CONSTANTS.USER_KEY,
          JSON.stringify(action.payload.user),
        );
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
        state.success =
          action.payload.message || "Profile updated successfully!";
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
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success =
          action.payload.message || "Password changed successfully!";
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
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success =
          action.payload.message || "Password reset link sent to your email!";
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
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success =
          action.payload.message || "Password reset successful! Please log in.";
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
