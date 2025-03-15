import React from "react";
import { Nav, NavDropdown, Image, Button, Col, Container } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, HouseDoor } from "react-bootstrap-icons";
import loginImage from '../assets/images/fpt-login.jpg';

const Sidebar = ({ user, handleProfileRedirect, handleLogout }) => {
    return (
        <Col
            xs={2}
            className="p-0 sidebar-container"
            style={{
                background: "linear-gradient(135deg, #FF4F70 0%, #FF1A55 100%)",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                borderRight: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
        >
            <Container fluid className="d-flex flex-column h-100">
                {/* Profile Section */}
                <div className="text-center py-4 border-bottom border-white border-opacity-25">
                    <Image
                        src={loginImage}
                        roundedCircle
                        className="mb-3 shadow-sm"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <h5
                        onClick={handleProfileRedirect}
                        className="text-white mb-2 cursor-pointer"
                        style={{
                            cursor: "pointer",
                            transition: "opacity 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        Xin chào, {user.username}
                    </h5>
                </div>

                {/* Navigation Links */}
                <Nav className="flex-column flex-grow-1 py-3">
                    {user.role === "Admin" ? (
                        <>
                            <Nav.Link href="/home" className="text-white d-flex align-items-center py-2 nav-hover">
                                <House className="me-2" /> Bảng tin
                            </Nav.Link>
                            <Nav.Link href="/apartment-manage" className="text-white d-flex align-items-center py-2 nav-hover">
                                <Gear className="me-2" /> Tòa nhà
                            </Nav.Link>
                            <NavDropdown
                                title={
                                    <span className="text-white d-flex align-items-center">
                                        <HandThumbsUp className="me-2" /> Dịch vụ
                                    </span>
                                }
                                id="customer-dropdown"
                                className="custom-dropdown"
                            >
                                <NavDropdown.Item href="/service/manage">Quản lý dịch vụ</NavDropdown.Item>
                                <NavDropdown.Item href="/service/request">Quản lý yêu cầu dịch vụ</NavDropdown.Item>
                                <NavDropdown.Item href="/service/payment">Thanh toán phí dịch vụ</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="service_payment" className="text-white d-flex align-items-center py-2 nav-hover">
                                <CreditCard className="me-2" /> Phí dịch vụ
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white d-flex align-items-center py-2 nav-hover">
                                <FileText className="me-2" /> Ghi chỉ số
                            </Nav.Link>
                            <NavDropdown
                                title={
                                    <span className="text-white d-flex align-items-center">
                                        <HandThumbsUp className="me-2" /> Khách hàng
                                    </span>
                                }
                                id="customer-dropdown"
                                className="custom-dropdown"
                            >
                                <NavDropdown.Item href="/customer/view">Khách hẹn xem</NavDropdown.Item>
                                <NavDropdown.Item href="#">Khách đã cọc</NavDropdown.Item>
                                <NavDropdown.Item href="/customer/rent">Khách yêu cầu thuê</NavDropdown.Item>
                                <NavDropdown.Item href="#">Hợp đồng</NavDropdown.Item>
                            </NavDropdown>
                        </>
                    ) : (
                        <>
                            <Nav.Link href="/home" className="text-white d-flex align-items-center py-2 nav-hover">
                                <House className="me-2" /> Trang chủ
                            </Nav.Link>
                            <Nav.Link href="/find" className="text-white d-flex align-items-center py-2 nav-hover">
                                <HouseDoor className="me-2" /> Tìm kiếm căn hộ
                            </Nav.Link>
                            <Nav.Link href="/service" className="text-white d-flex align-items-center py-2 nav-hover">
                                <Gear className="me-2" /> Dịch vụ
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white d-flex align-items-center py-2 nav-hover">
                                <CreditCard className="me-2" /> Thanh toán
                            </Nav.Link>
                            <Nav.Link href="#" className="text-white d-flex align-items-center py-2 nav-hover">
                                <FileText className="me-2" /> Điều khoản
                            </Nav.Link>
                        </>
                    )}
                </Nav>

                {/* Logout Section */}
                <div className="p-3 border-top border-white border-opacity-25">
                    <Button
                        variant="outline-light"
                        className="w-100 d-flex align-items-center justify-content-center"
                        onClick={handleLogout}
                        style={{
                            transition: "all 0.3s ease",
                        }}
                    >
                        <BoxArrowRight className="me-2" /> Đăng xuất
                    </Button>
                </div>
            </Container>

            {/* Custom CSS */}
            <style jsx>{`
                .nav-hover:hover {
                    background-color: rgba(255,255,255,0.1);
                    transition: background-color 0.3s ease;
                }
                .custom-dropdown .dropdown-menu {
                    background-color: #FF4F70;
                    border: none;
                }
                .custom-dropdown .dropdown-item {
                    color: white;
                }
                .custom-dropdown .dropdown-item:hover {
                    background-color: rgba(255,255,255,0.1);
                }
            `}</style>
        </Col>
    );
};

export default Sidebar;