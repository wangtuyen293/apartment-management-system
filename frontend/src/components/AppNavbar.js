import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Button,
    Dropdown,
    Image,
} from "react-bootstrap";
import avatar from "../assets/images/avatar/avatar.jpg";
import { logoutUser } from "../redux/authSlice";
import "../assets/css/AppNavbar.css";

const AppNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const isAuthenticated = user !== null;
    const userRole = user?.role || "Guest";

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="custom-navbar shadow-sm fixed-top">
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bolder text-primary"
                >
                    FPT PLAZA
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link
                        as={Link}
                        to="/"
                        active={location.pathname === "/"}
                    >
                        Trang Chủ
                    </Nav.Link>
                    <Nav.Link
                        as={Link}
                        to="/find"
                        active={location.pathname === "/"}
                    >
                        Căn Hộ
                    </Nav.Link>
                    {userRole === "User" && (
                        <>
                            <Nav.Link
                                as={Link}
                                to="/view-payment"
                                active={location.pathname === "/transactions"}
                            >
                                Thanh toán
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/profile/transactions"
                                active={location.pathname === "/transactions"}
                            >
                                Giao Dịch
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/service"
                                active={location.pathname === "/services"}
                            >
                                Dịch Vụ
                            </Nav.Link>
                        </>
                    )}
                    {userRole === "Manager" && (
                        <>
                            <Nav.Link
                                as={Link}
                                to="/admin"
                                active={location.pathname === "/admin"}
                            >
                                Quản Lý
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/statistics"
                                active={location.pathname === "/statistics"}
                            >
                                Thống Kê
                            </Nav.Link>
                        </>
                    )}
                </Nav>

                <Nav className="gap-2">
                    {isAuthenticated ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="white"
                                id="dropdown-basic"
                                className="d-flex align-items-center"
                            >
                                <Image
                                    src={user?.avatar || avatar}
                                    roundedCircle
                                    width="32"
                                    height="32"
                                    className="me-2"
                                />
                                {user.name}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">
                                    Hồ Sơ
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <>
                            <Button variant="dark" as={Link} to="/login">
                                Đăng Nhập
                            </Button>
                            <Button
                                variant="outline-dark"
                                as={Link}
                                to="/register"
                            >
                                Đăng Ký
                            </Button>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
