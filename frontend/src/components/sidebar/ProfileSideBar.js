import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
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
import avatarImage from "../../assets/images/avatar/avatar.jpg";
import "../../assets/css/ProfileSidebar.css";

const ProfileSideBar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const backendUrl = "http://localhost:5000";
    const avatarUrl = user?.images?.[0]?.url ? `${backendUrl}${user.images[0].url}` : avatarImage;

    const userRole = user?.role || "Guest";

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar"
                />
                <h4>{user?.name}</h4>
                <p className="role">
                    {user?.role === "resident" ? "Cư Dân" : "Quản Lý"}
                </p>
            </div>

            <ul className="sidebar-links">
                <li>
                    <Link to="/profile">
                        <FaUser /> Hồ Sơ Cá Nhân
                    </Link>
                </li>
                <li>
                    <Link to="/profile/change-password">
                        <FaLock /> Đổi Mật Khẩu
                    </Link>
                </li>
                <li>
                    <Link to="/profile/my-apartments">
                        <FaHome /> Căn Hộ Của Tôi
                    </Link>
                </li>
                <li>
                    <Link to="/profile/contract">
                        <FaList /> Hợp đồng Của Tôi
                    </Link>
                </li>
                <li>
                    <Link to="/profile/transactions">
                        <FaHistory /> Lịch Sử Giao Dịch
                    </Link>
                </li>
                <li>
                    <Link to="/profile/service-requests">
                        <FaTools /> Yêu Cầu Dịch Vụ
                    </Link>
                </li>
                <li>
                    <Link to="/profile/settings">
                        <FaCog /> Cài Đặt
                    </Link>
                </li>
            </ul>

            <div className="logout-section">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Đăng Xuất
                </button>
            </div>
        </div>
    );
};

export default ProfileSideBar;
