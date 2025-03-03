import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import apartmentReducer from "./apartmentSlice.js";
import residentReducer from "./residentSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        apartment: apartmentReducer,
        resident: residentReducer,
    },
});

export default store;