import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearError, resetState, logout } = authSlice.actions;
export default authSlice.reducer;