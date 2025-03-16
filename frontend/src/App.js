import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Success from "./pages/payment/success";
import Cancel from "./pages/payment/cancel";
import ViewAllPayment from "./pages/payment/viewAllPayment";
import FeeManagement from "./pages/customerManagement/FeeManagement";
import ServiceManagementPage from "./pages/service/ServiceManagementPage";
import MyApartmentPage from "./pages/apartment/MyApartment";

function App() {
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
                <Route path="/customer/view" element={<CustomerRequestView />} />
                <Route path="/customer/rent" element={<CustomerRequestRent />} />
                <Route path="/apartment-manage" element={<ApartmentManagement />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/view-payment" element={<ViewAllPayment />} />
                <Route path="/fee-manage" element={<FeeManagement />} />
                <Route path="/service/manage" element={<ServiceManagementPage />} />
                <Route path="/myapartment" element={<MyApartmentPage />} />
            </Routes>
        </Router>
    );
}

export default App;
