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


const apartmentSlice = createSlice({
    name: "apartment",
    initialState: {
        apartment: null,
        apartmentDetail: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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

    },
});

export default apartmentSlice.reducer;
