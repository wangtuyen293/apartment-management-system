import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/services";

// ========================== CRUD: ServiceCategory ==========================

// Lấy tất cả danh mục dịch vụ
export const getAllServiceCategories = createAsyncThunk(
    "service/getAllServiceCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/categories`); // Kiểm tra API endpoint
            return response.data; // Đảm bảo API trả về danh sách đúng định dạng
        } catch (error) {
            return rejectWithValue(error.response?.data || "Có lỗi xảy ra!");
        }
    }
);

// Tạo danh mục dịch vụ mới
export const createServiceCategory = createAsyncThunk(
    "serviceCategory/create",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/categories`, categoryData);
            return response.data;   
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Cập nhật danh mục dịch vụ
export const updateServiceCategory = createAsyncThunk(
    "serviceCategory/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/categories/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Xóa danh mục dịch vụ
export const deleteServiceCategory = createAsyncThunk(
    "serviceCategory/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/categories/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// ========================== CRUD: ServiceOrder ==========================

// Lấy tất cả đơn đặt dịch vụ
export const getAllServiceOrders = createAsyncThunk(
    "serviceOrder/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/orders`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Tạo đơn đặt dịch vụ mới
export const createServiceOrder = createAsyncThunk(
    "serviceOrder/create",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/orders`, orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Xóa đơn đặt dịch vụ
export const deleteServiceOrder = createAsyncThunk(
    "serviceOrder/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/orders/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// ========================== CRUD: ServiceRequest ==========================

// Lấy tất cả yêu cầu dịch vụ
export const getAllServiceRequests = createAsyncThunk(
    "serviceRequest/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/requests`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Tạo yêu cầu dịch vụ mới
export const createServiceRequest = createAsyncThunk(
    "serviceRequest/create",
    async (requestData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/requests`, requestData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Cập nhật trạng thái yêu cầu dịch vụ
export const updateServiceRequest = createAsyncThunk(
    "serviceRequest/update",
    async ({ id, data }, { rejectWithValue }) => { // Đổi requestData thành data
        try {
            const response = await axios.put(`${API_URL}/requests/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Xóa yêu cầu dịch vụ
export const deleteServiceRequest = createAsyncThunk(
    "serviceRequest/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/requests/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// ========================== Thêm/Xóa ServiceOrder vào Apartment ==========================

// Thêm ServiceOrder vào Apartment
export const addServiceOrderToApartment = createAsyncThunk(
    "apartment/addServiceOrder",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/apartments/add/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// Xóa ServiceOrder khỏi Apartment
export const removeServiceOrderFromApartment = createAsyncThunk(
    "apartment/removeServiceOrder",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/apartments/remove/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);

// ========================== Slice ==========================

const serviceSlice = createSlice({
    name: "service",
    initialState: {
        serviceCategories: [],
        serviceOrders: [],
        serviceRequests: [],
        apartments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllServiceCategories.fulfilled, (state, action) => {
                state.serviceCategories = action.payload;
            })
            .addCase(createServiceCategory.fulfilled, (state, action) => {
                state.serviceCategories.push(action.payload);
            })
            .addCase(deleteServiceCategory.fulfilled, (state, action) => {
                state.serviceCategories = state.serviceCategories.filter(cat => cat._id !== action.payload);
            })

            .addCase(getAllServiceOrders.fulfilled, (state, action) => {
                state.serviceOrders = action.payload;
            })
            .addCase(createServiceOrder.fulfilled, (state, action) => {
                state.serviceOrders.push(action.payload);
            })
            .addCase(deleteServiceOrder.fulfilled, (state, action) => {
                state.serviceOrders = state.serviceOrders.filter(order => order._id !== action.payload);
            })

            .addCase(getAllServiceRequests.fulfilled, (state, action) => {
                state.serviceRequests = action.payload;
            })
            .addCase(createServiceRequest.fulfilled, (state, action) => {
                state.serviceRequests.push(action.payload);
            })
            .addCase(deleteServiceRequest.fulfilled, (state, action) => {
                state.serviceRequests = state.serviceRequests.filter(req => req._id !== action.payload);
            })

            .addCase(addServiceOrderToApartment.fulfilled, (state, action) => {
                state.apartments = state.apartments.map(apt =>
                    apt._id === action.payload._id ? action.payload : apt
                );
            })
            .addCase(removeServiceOrderFromApartment.fulfilled, (state, action) => {
                state.apartments = state.apartments.map(apt =>
                    apt._id === action.payload._id ? action.payload : apt
                );
            })

            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export default serviceSlice.reducer;
