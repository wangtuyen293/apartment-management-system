import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/forgot-password`,
                { email }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/reset-password/${token}`,
                {
                    newPassword,
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const passwordSlice = createSlice({
    name: "password",
    initialState: {
        loading: false,
        message: null,
        error: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to send reset email.";
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to reset password.";
            });
    },
});

export const { clearMessages } = passwordSlice.actions;
export default passwordSlice.reducer;
