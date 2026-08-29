export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            // The backend returns { message: "...", user: {...} }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const registerUser = register;

// In extraReducers:
.addCase(register.fulfilled, (state, action) => {
    state.isLoading = false;
    state.success = action.payload?.message || 'Registration successful! Please login.';
    state.error = null;
})