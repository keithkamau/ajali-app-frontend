import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    success: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const registerUser = register;

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const { access_token, refresh_token, user } = response.data;
            
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            return { user };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const loginUser = login;

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getCurrentUser();
            return response.data.user;
        } catch (error) {
            // Clear invalid tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.updateProfile(userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const updateUser = updateProfile;

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authApi.changePassword(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authApi.forgotPassword(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await authApi.resetPassword(token, newPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        resetState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.success = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.success = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.success = 'Registration successful! Please login.';
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.success = 'Login successful!';
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
                state.success = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.success = 'Profile updated successfully!';
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.success = 'Password changed successfully!';
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload?.message || 'Password reset email sent!';
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload?.message || 'Password reset successfully!';
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = null;
            });
    },
});

export const { clearError, clearSuccess, resetState, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;