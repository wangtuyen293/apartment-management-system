import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../assets/css/AppNavbar.css"

const AppNavbar = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    const isAuthenticated = user !== null;
    const userRole = user?.role || "guest";

    return (
        <Navbar expand="lg" className="custom-navbar shadow-sm fixed-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bolder text-primary">
                    FPT PLAZA
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
                        Trang Chủ
                    </Nav.Link>
                    <Nav.Link as={Link} to="/apartments" active={location.pathname === "/apartments"}>
                        Danh Sách Căn Hộ
                    </Nav.Link>
                    {userRole === "resident" && (
                        <>
                            <Nav.Link as={Link} to="/transactions" active={location.pathname === "/transactions"}>
                                Giao Dịch
                            </Nav.Link>
                            <Nav.Link as={Link} to="/services" active={location.pathname === "/services"}>
                                Dịch Vụ
                            </Nav.Link>
                        </>
                    )}
                    {userRole === "manager" && (
                        <>
                            <Nav.Link as={Link} to="/admin" active={location.pathname === "/admin"}>
                                Quản Lý
                            </Nav.Link>
                            <Nav.Link as={Link} to="/statistics" active={location.pathname === "/statistics"}>
                                Thống Kê
                            </Nav.Link>
                        </>
                    )}
                </Nav>

                <Nav className="gap-2">
                    {isAuthenticated ? (
                        <>
                            <Button variant="dark" as={Link} to="/profile">
                                Hồ Sơ
                            </Button>
                            <Button variant="outline-dark" onClick={() => setUser(null)}>
                                Đăng Xuất
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="dark" as={Link} to="/auth/login">
                                Đăng Nhập
                            </Button>
                            <Button variant="outline-dark" as={Link} to="/auth/register">
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
