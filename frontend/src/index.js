import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { store, persistor } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </CookiesProvider>
    </React.StrictMode>
);
