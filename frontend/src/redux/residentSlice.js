import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";

const API_URL = "http://localhost:5000";

export const getCustomerViewApartment = createAsyncThunk(
    "resident/view",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/v1/residents/view`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getCustomerRequestRentApartment = createAsyncThunk(
    "resident/pending",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/v1/residents/pending`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const ApproveRentApartment = createAsyncThunk(
    "resident/approve",
    async (requestId, { rejectWithValue }) => {
        console.log(requestId)
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/approve`,
                { requestId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const RejectRentApartment = createAsyncThunk(
    "resident/reject",
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/reject`,
                { requestId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "resident",
    initialState: {
        resident: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomerViewApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerViewApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(getCustomerViewApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

        builder
            .addCase(getCustomerRequestRentApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerRequestRentApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(getCustomerRequestRentApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

        builder
            .addCase(ApproveRentApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(ApproveRentApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(ApproveRentApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

        builder
            .addCase(RejectRentApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(RejectRentApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(RejectRentApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
