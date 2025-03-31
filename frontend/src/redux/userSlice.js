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

export const uploadAvatar = createAsyncThunk(
    "user/uploadAvatar",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/users/me/upload-avatar`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload avatar"
            );
        }
    }
);

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

// Admin
export const banUser = createAsyncThunk(
    "user/banUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/users/ban/${userId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Không thể khóa/mở khóa tài khoản"
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/users/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Không thể xóa tài khoản"
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
                state.users = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Lỗi không xác định";
                state.users = [];
            })
            
            // Ban User
            .addCase(banUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(banUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.map((user) =>
                    user._id === action.payload.user._id
                        ? action.payload.user
                        : user
                );
                state.successMessage = action.payload.message;
            })
            .addCase(banUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(
                    (user) => user._id !== action.meta.arg
                );
                state.successMessage = action.payload.message;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.user.images = [{ url: action.payload.avatarUrl }];
            });
    },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
