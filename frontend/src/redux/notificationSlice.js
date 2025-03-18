import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/notifications";

// ========================== CRUD: Notifications ==========================

// 🟢 Lấy tất cả thông báo của một User
export const getUserNotifications = createAsyncThunk(
    "notification/getUserNotifications",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi lấy thông báo!");
        }
    }
);

// 🟢 Lấy tất cả thông báo (Admin hoặc hệ thống)
export const getAllNotifications = createAsyncThunk(
    "notification/getAllNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi lấy tất cả thông báo!");
        }
    }
);

// 🟢 Tạo một thông báo mới
export const createNotification = createAsyncThunk(
    "notification/create",
    async (notificationData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, notificationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi tạo thông báo!");
        }
    }
);

// 🟢 Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
    "notification/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/read`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi cập nhật thông báo!");
        }
    }
);

// 🟢 Xóa một thông báo
export const deleteNotification = createAsyncThunk(
    "notification/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi xóa thông báo!");
        }
    }
);

// 🟢 Gửi thông báo đến tất cả người dùng
export const sendNotificationToAllUsers = createAsyncThunk(
    "notification/sendToAll",
    async (notificationData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/send-all`, notificationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi khi gửi thông báo!");
        }
    }
);

// ========================== Slice ==========================
const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.loading = false;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.loading = false;
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.notifications.push(action.payload);
                state.loading = false;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n._id !== action.payload);
                state.loading = false;
            })
            .addCase(sendNotificationToAllUsers.fulfilled, (state, action) => {
                state.notifications = [...state.notifications, ...action.payload];
                state.loading = false;
            })

            // Xử lý trạng thái pending
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // Xử lý trạng thái rejected
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export default notificationSlice.reducer;
