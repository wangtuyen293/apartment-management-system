import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./authSlice.js";
import apartmentReducer from "./apartmentSlice.js";
import residentReducer from "./residentSlice.js";

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedReducer,
        apartment: apartmentReducer,
        resident: residentReducer,
    },
});

const persistor = persistStore(store);

export { store, persistor };