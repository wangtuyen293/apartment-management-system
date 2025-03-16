import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const payForDeposit = createAsyncThunk(
    "payment/deposit",
    async ({ userId, apartmentId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/payments/deposit`,
                { userId, apartmentId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const saveTransaction = createAsyncThunk(
    "payment/save",
    async ({ orderCode, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/payments/save`,
                { orderCode, userId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const getAllPayment = createAsyncThunk(
    "payment/getbill",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/payments/getbill`,
                { id }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const BillPayment = createAsyncThunk(
    "payment/pay",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/payments/pay`,
                { id }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        payment: null,
        bill: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.payment = null;
            state.bill = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(payForDeposit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payForDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload;
            })
            .addCase(payForDeposit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to make deposit";
            })

            .addCase(saveTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload;
            })
            .addCase(saveTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to save transaction";
            })

            .addCase(getAllPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.bill = action.payload;
            })
            .addCase(getAllPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(BillPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BillPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.bill = action.payload;
            })
            .addCase(BillPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to fetch bills";
            });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;