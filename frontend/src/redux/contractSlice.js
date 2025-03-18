import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const openDepositContract = createAsyncThunk(
    "contract/depositContract",
    async ({ apartmentId, userId, date }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/contracts/deposit/${apartmentId}`,
                { userId, date },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

export const signDepositContract = createAsyncThunk(
    "contract/signDepositContract",
    async ({ apartmentId, userId, signature, contractMonths }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/contracts/deposit/sign/${apartmentId}`,
                { userId, signature, contractMonths },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const contractSlice = createSlice({
    name: "contract",
    initialState: {
        contract: null,
        contractPath: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetContractState: (state) => {
            state.contract = null;
            state.contractPath = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(openDepositContract.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contractPath = null;
            })
            .addCase(openDepositContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contract = action.payload;
                state.contractPath = action.payload.contractPath;
            })
            .addCase(openDepositContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to make deposit";
                state.contractPath = null;
            })
            .addCase(signDepositContract.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signDepositContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contract = action.payload;
                state.contractPath = action.payload.contractPath;
            })
            .addCase(signDepositContract.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to sign deposit contract";
            });
    },
});

export const { resetContractState } = contractSlice.actions;
export default contractSlice.reducer;