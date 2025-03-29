import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import apartmentReducer from "./apartmentSlice";
import residentReducer from "./residentSlice";
import serviceReducer from "./serviceSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import contractReducer from "./contractSlice.js";
import paymentReducer from "./paymentSlice.js";
import notificationReducer from "./notificationSlice.js";
import userReducer from "./userSlice.js";
import passwordReducer from "./passwordSlice.js";

// Cấu hình redux-persist cho auth
const persistConfig = {
    key: "auth",
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        user: userReducer,
        password: passwordReducer,
        apartment: apartmentReducer,
        resident: residentReducer,
        contract: contractReducer,
        payment: paymentReducer,
        bill: paymentReducer,
        service: serviceReducer,
        notification: notificationReducer,
    },
});

const persistor = persistStore(store);

export { store, persistor };
