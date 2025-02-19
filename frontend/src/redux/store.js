import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import apartmentReducer from "./apartmentSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        apartment: apartmentReducer,
    },
});

export default store;