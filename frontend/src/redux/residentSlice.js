import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const getCustomerDeposit = createAsyncThunk(
    "resident/deposit",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/v1/residents/deposit`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getBill = createAsyncThunk(
    "resident/billstatus",
    async ({ apartment_id }, { rejectWithValue }) => {
        try {
            console.log(apartment_id)
            const response = await axios.get(
                `${API_URL}/api/v1/residents/bill-status`,
                { apartment_id }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

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

export const ApproveViewApartment = createAsyncThunk(
    "resident/approve-view",
    async (requestId, { rejectWithValue }) => {
        console.log(requestId)
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/approve-view`,
                { requestId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const RejectViewApartment = createAsyncThunk(
    "resident/reject-view",
    async (requestId, { rejectWithValue }) => {
        console.log(requestId)
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/reject-view`,
                { requestId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const ApproveRentApartment = createAsyncThunk(
    "resident/approve-rent",
    async ({ requestId, date, duration }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/approve-rent`,
                { requestId, date, duration }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const RejectRentApartment = createAsyncThunk(
    "resident/reject-rent",
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/reject-rent`,
                { requestId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllResidents = createAsyncThunk(
    "resident/all",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/v1/residents/all`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateIndex = createAsyncThunk(
    "resident/update-index",
    async ({ apartmentId, electron, water, date }, { rejectWithValue }) => {
        try {

            const response = await axios.post(
                `${API_URL}/api/v1/residents/update-index`,
                { apartmentId, electron, water, date }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendBill = createAsyncThunk(
    "resident/send-bill",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/residents/send-bill`,
                { id }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const residentSlice = createSlice({
    name: "resident",
    initialState: {
        resident: null,
        bill: null,
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
            .addCase(getCustomerDeposit.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(getCustomerDeposit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
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
            .addCase(ApproveViewApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(ApproveViewApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(ApproveViewApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

        builder
            .addCase(RejectViewApartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(RejectViewApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(RejectViewApartment.rejected, (state, action) => {
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

        builder
            .addCase(getAllResidents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllResidents.fulfilled, (state, action) => {
                state.loading = false;
                state.resident = action.payload;
            })
            .addCase(getAllResidents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(updateIndex.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateIndex.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateIndex.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(sendBill.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendBill.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(sendBill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getBill.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBill.fulfilled, (state, action) => {
                state.loading = false;
                state.bill = action.payload;
            })
            .addCase(getBill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { logout } = residentSlice.actions;
export default residentSlice.reducer;
