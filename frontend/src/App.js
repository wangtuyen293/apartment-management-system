import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAuthState } from "./redux/authSlice";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Home from "./pages/layout/Home";
import LandingPage from "./pages/layout/LandingPage";
import ApartmentDetailPage from "./pages/apartment/ApartmentDetailPage";
import FindApartments from "./pages/apartment/FindApartment";
import VerifyEmail from "./pages/user/VerifyEmail";
import CustomerRequestView from "./pages/customerManagement/customerRequestView";
import CustomerRequestRent from "./pages/customerManagement/customerRequestRent";
import ApartmentManagement from "./pages/customerManagement/apartmentManagement";
import ProfilePage from "./pages/user/ProfilePage";
import Layout from "./components/layout/Layout";
import ProfileLayout from "./components/layout/ProfileLayout";
import ContractPage from "./pages/contract/ContractPage";
import TransactionHistoryPage from "./pages/transaction/TransactionHistoryPage";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetAuthState());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />

                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/profile/*" element={<ProfileLayout />}>
                        <Route index element={<ProfilePage />} />
                        <Route path="contract" element={<ContractPage />} />
                        <Route
                            path="transactions"
                            element={<TransactionHistoryPage />}
                        />
                    </Route>
                </Route>

                <Route
                    path="/apartment/:id"
                    element={<ApartmentDetailPage />}
                />
                <Route path="/find" element={<FindApartments />} />
                <Route
                    path="/customer/view"
                    element={<CustomerRequestView />}
                />
                <Route
                    path="/customer/rent"
                    element={<CustomerRequestRent />}
                />
                <Route
                    path="/apartment-manage"
                    element={<ApartmentManagement />}
                />
            </Routes>
        </Router>
    );
}

export default App;
