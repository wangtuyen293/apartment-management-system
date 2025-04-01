import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import { FaUsers, FaHome, FaHistory, FaTools, FaCog, FaSignOutAlt, FaChartBar, FaBuilding } from "react-icons/fa";
import { Button, Image } from "react-bootstrap";
import avatarImage from "../../assets/images/avatar/avatar.jpg";
import "../../assets/css/ManagerSidebar.css";

const ManagerSideBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const backendUrl = "http://localhost:5000";
    const avatarSrc = user?.images?.[0]?.url ? `${backendUrl}${user.images[0].url}` : avatarImage;

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header text-center">
                <Image src={avatarSrc} alt="Admin Avatar" className="avatar" roundedCircle />
                <h4 className="username">{user?.name}</h4>
                <p className="role">Quản Lý</p>
            </div>

            <nav className="sidebar-menu">
                <Link to="/admin" className={`menu-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}>
                    <FaChartBar className="icon" /> Thống Kê
                </Link>
                <Link to="/admin/users" className={`menu-item ${location.pathname === "/admin/users" ? "active" : ""}`}>
                    <FaUsers className="icon" /> Quản Lý Người Dùng
                </Link>
                <Link to="/admin/apartments" className={`menu-item ${location.pathname === "/admin/apartments" ? "active" : ""}`}>
                    <FaBuilding className="icon" /> Quản Lý Căn Hộ
                </Link>
                <Link to="/admin/transactions" className={`menu-item ${location.pathname === "/admin/transactions" ? "active" : ""}`}>
                    <FaHistory className="icon" /> Quản Lý Giao Dịch
                </Link>
                <Link to="/admin/service-requests" className={`menu-item ${location.pathname === "/admin/service-requests" ? "active" : ""}`}>
                    <FaTools className="icon" /> Quản Lý Dịch Vụ
                </Link>
                <Link to="/admin/settings" className={`menu-item ${location.pathname === "/admin/settings" ? "active" : ""}`}>
                    <FaCog className="icon" /> Cài Đặt
                </Link>
            </nav>

            <div className="logout-section mt-5">
                <Button variant="danger" className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" /> Đăng Xuất
                </Button>
            </div>
        </div>
    );
};

export default ManagerSideBar;
