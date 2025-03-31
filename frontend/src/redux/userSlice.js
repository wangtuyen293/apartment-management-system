import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

axios.defaults.withCredentials = true;

export const fetchUsers = createAsyncThunk(
    "auth/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/users`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || error.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/users/me`);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    "user/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/users/me`, userData);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update user profile"
            );
        }
    }
);

export const uploadAvatar = createAsyncThunk("user/uploadAvatar", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/users/me/upload-avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to upload avatar");
    }
});

export const changePassword = createAsyncThunk(
    "user/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/users/me/change-password`,
                passwordData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        user: null,
        loading: false,
        error: null,
        successMessage: "",
    },
    reducers: {
        clearMessage: (state) => {
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Lỗi không xác định";
                state.users = [];
            })

            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.successMessage = "Profile updated successfully!";
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(changePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Password changed successfully!";
                state.error = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Upload Avatar
            .addCase(uploadAvatar.fulfilled, (state, action) => { state.user.images = [{ url: action.payload.avatarUrl }]; });
    },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
