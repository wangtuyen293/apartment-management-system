import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const getApartment = createAsyncThunk(
    "apartment/getApartment",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/apartments`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const getApartmentDetail = createAsyncThunk(
    "apartment/getApartmentDetail",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/apartments/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const addApartment = createAsyncThunk(
    "apartment/addApartment",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/apartments/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error adding apartment");
        }
    }
);

export const changeApartmentDetail = createAsyncThunk(
    "apartment/changeApartmentDetail",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/v1/apartments/update/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const deleteApartment = createAsyncThunk(
    "apartment/deleteApartment",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/api/v1/apartments/delete/${id}`);
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const removeContract = createAsyncThunk(
    "apartment/removeContract",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/v1/apartments/contract-remove/${id}`);
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const extendContract = createAsyncThunk(
    "apartment/extendContract",
    async ({ id, startDate, endDate }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/v1/apartments/contract/${id}`,
                { startDate, endDate }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const userExtendContract = createAsyncThunk(
    "contract/userExtendContract",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/apartments/contracts/extend`, { payload });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const terminateContract = createAsyncThunk(
    "contract/terminateContract",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/apartments/contracts/terminate`, { payload });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const requestForViewApartment = createAsyncThunk(
    "apartment/requestForViewApartment",
    async ({ apartmentId, tenantId, date }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/apartments/view/${apartmentId}/${tenantId}`,
                { date }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const requestForRentApartment = createAsyncThunk(
    "apartment/requestForRentApartment",
    async ({ apartmentId, tenantId, date, contractMonths }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/apartments/rent/${apartmentId}/${tenantId}`,
                { date, contractMonths }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const apartmentSlice = createSlice({
    name: "apartment",
    initialState: {
        apartment: [],
        apartmentDetail: null,
        loading: false,
        error: null,
        viewRequestStatus: null,
        rentRequestStatus: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Apartments
            .addCase(getApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.apartment = action.payload;
            })
            .addCase(getApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch apartments";
            })
            // Fetch Apartment Detail
            .addCase(getApartmentDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApartmentDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.apartmentDetail = action.payload;
            })
            .addCase(getApartmentDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch apartment detail";
            })
            // Add Apartment
            .addCase(addApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.apartment.push(action.payload);
            })
            .addCase(addApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add apartment";
            })
            // Update Apartment
            .addCase(changeApartmentDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeApartmentDetail.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.apartment.findIndex((apt) => apt._id === action.payload._id);
                if (index !== -1) {
                    state.apartment[index] = action.payload;
                }
            })
            .addCase(changeApartmentDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update apartment";
            })
            // Delete Apartment
            .addCase(deleteApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.apartment = state.apartment.filter((apt) => apt._id !== action.payload.id);
            })
            .addCase(deleteApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete apartment";
            })
            // Remove Contract
            .addCase(removeContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeContract.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.apartment.findIndex((apt) => apt._id === action.payload.id);
                if (index !== -1) {
                    state.apartment[index].startRentDate = null;
                    state.apartment[index].endRentDate = null;
                    state.apartment[index].status = "Trống";
                }
            })
            .addCase(removeContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove contract";
            })
            // Extend Contract
            .addCase(extendContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(extendContract.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.apartment.findIndex((apt) => apt._id === action.payload._id);
                if (index !== -1) {
                    state.apartment[index] = action.payload;
                }
            })
            .addCase(extendContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to extend contract";
            })
            // Request for View Apartment
            .addCase(requestForViewApartment.pending, (state) => {
                state.loading = true;
                state.viewRequestStatus = null;
                state.error = null;
            })
            .addCase(requestForViewApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.viewRequestStatus = action.payload.message;
            })
            .addCase(requestForViewApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to request for view apartment";
            })
            // Request for Rent Apartment
            .addCase(requestForRentApartment.pending, (state) => {
                state.loading = true;
                state.rentRequestStatus = null;
                state.error = null;
            })
            .addCase(requestForRentApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.rentRequestStatus = action.payload.message;
            })
            .addCase(requestForRentApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to request for rent apartment";
            });
        builder
            // Extend Contract by User
            .addCase(userExtendContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userExtendContract.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(userExtendContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to extend contract by user";
            })
            // Terminate Contract
            .addCase(terminateContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(terminateContract.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(terminateContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to terminate contract";
            });
    },
});

export default apartmentSlice.reducer;