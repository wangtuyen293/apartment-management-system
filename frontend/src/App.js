import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserProfilePage from "./pages/UserProfile";
import LandingPage from "./pages/LandingPage";
import ApartmentDetailPage from "./pages/ApartmentDetailPage";
import FindApartments from "./pages/FindApartment";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/apartment/:id" element={<ApartmentDetailPage />} />
                <Route path="/find" element={<FindApartments />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
        </Router>
    );
}

export default App;
