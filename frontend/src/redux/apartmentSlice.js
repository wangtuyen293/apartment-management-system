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

export const addApartment = createAsyncThunk(
    'apartment/addApartment',
    async (formData, { rejectWithValue }) => {
        try {
            console.log(formData)
            const response = await axios.post(`${API_URL}/api/v1/apartments/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error adding apartment');
        }
    }
);


const apartmentSlice = createSlice({
    name: "apartment",
    initialState: {
        apartment: null,
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
            })
            .addCase(getApartmentDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.apartmentDetail = action.payload;
            })
            .addCase(getApartmentDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
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
            })
            // Add new apartment
            .addCase(addApartment.pending, (state) => {
                state.loading = true;
                state.rentRequestStatus = null;
                state.error = null;
            })
            .addCase(addApartment.fulfilled, (state, action) => {
                state.loading = false;
                state.apartment = action.payload;
            })
            .addCase(addApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed ";
            })
    },
});

export default apartmentSlice.reducer;
