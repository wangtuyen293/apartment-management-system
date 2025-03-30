import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Image, Button } from "react-bootstrap";
import {
    FaUser,
    FaLock,
    FaHome,
    FaHistory,
    FaTools,
    FaCog,
    FaSignOutAlt,
    FaList,
} from "react-icons/fa";
import { logoutUser } from "../../redux/authSlice";
import avatarImage from "../../assets/images/avatar/avatar.jpg";
import "../../assets/css/ProfileSidebar.css";

const ProfileSideBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const location = useLocation();

    const backendUrl = "http://localhost:5000";
    const avatarUrl = user?.images?.[0]?.url
        ? `${backendUrl}${user.images[0].url}`
        : avatarImage;

    const userRole = user?.role || "Guest";

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <>
            <div className="admin-sidebar">
                <div className="sidebar-header text-center">
                    <Image
                        src={avatarUrl}
                        alt="Avatar"
                        className="avatar"
                        roundedCircle
                    />
                    <h4 className="username">{user?.name}</h4>
                    <p className="role">Quản Lý</p>
                </div>

                <nav className="sidebar-menu">
                    <Link
                        to="/profile"
                        className={`menu-item ${
                            location.pathname === "/profile" ? "active" : ""
                        }`}
                    >
                        <FaUser className="icon" /> Hồ Sơ Cá Nhân
                    </Link>
                    <Link
                        to="/profile/change-password"
                        className={`menu-item ${
                            location.pathname === "/profile/change-password"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaLock className="icon" /> Đổi Mật Khẩu
                    </Link>
                    <Link
                        to="/profile/my-apartments"
                        className={`menu-item ${
                            location.pathname === "/profile/my-apartments"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaHome className="icon" /> Căn Hộ Của Tôi
                    </Link>
                    <Link
                        to="/profile/contract"
                        className={`menu-item ${
                            location.pathname === "/profile/contract"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaList className="icon" /> Hợp đồng Của Tôi
                    </Link>
                    <Link
                        to="/profile/transactions"
                        className={`menu-item ${
                            location.pathname === "/profile/transactions"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaHistory className="icon" /> Lịch Sử Giao Dịch
                    </Link>
                    <Link
                        to="/profile/service-requests"
                        className={`menu-item ${
                            location.pathname === "/profile/service-requests"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaTools className="icon" /> Yêu Cầu Dịch Vụ
                    </Link>
                    <Link
                        to="/profile/settings"
                        className={`menu-item ${
                            location.pathname === "/profile/settings"
                                ? "active"
                                : ""
                        }`}
                    >
                        <FaCog className="icon" /> Cài Đặt
                    </Link>
                </nav>

                <div className="logout-section mt-5">
                    <Button
                        variant="danger"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="icon" /> Đăng Xuất
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ProfileSideBar;
