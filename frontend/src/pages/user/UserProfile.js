import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Card, Button, Image, NavDropdown } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, Chat, Share, HouseDoor } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import loginImage from '../../assets/images/fpt-login.jpg';

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded.user);
                setRole(decoded.user.role);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                {/* Sidebar */}
                <Col xs={2} className="p-0 position-fixed" style={{ background: "linear-gradient(180deg, #FF4F70, #FF1A55)", height: "100vh", top: 0, left: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #ddd" }}>
                    <Nav className="flex-column">
                        {role === "Admin" ? (
                            <>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <House className="me-2 fs-5" /> Bảng tin
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Tòa nhà
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Phí dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Ghi chỉ số
                                </Nav.Link>
                                <NavDropdown title={<span className="d-flex align-items-center text-white fs-5"><HandThumbsUp className="me-2" /> Khách hàng</span>} id="customer-nav-dropdown" className="text-white">
                                    <NavDropdown.Item href="#" >Khách hẹn xem</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã cọc</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã thuê</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Hợp đồng</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/home" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <House className="me-2 fs-5" /> Trang chủ
                                </Nav.Link>
                                <Nav.Link href="/find" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <HouseDoor className="me-2 fs-5" /> Tìm kiếm căn hộ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Thanh toán
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Điều khoản
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    {/* Sidebar Footer */}
                    <div className="text-center mt-auto p-3 text-white">
                        <Image src={loginImage} roundedCircle width="80" height="80" />
                        <p className="mt-2" onClick={handleProfileRedirect} style={{ cursor: "pointer", fontWeight: "bold" }}>
                            {userName ? userName : "Người dùng"}
                        </p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto" onClick={handleLogout} style={{ borderRadius: "30px", padding: "0.5rem 1.5rem" }}>
                            <BoxArrowRight className="me-2" /> Đăng xuất
                        </Button>
                    </div>
                </Col>

                {/* Content */}
                <Col xs={10} className="p-5 ms-auto" style={{ marginLeft: "16.67%" }}>
                    <h2>Hồ sơ người dùng</h2>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>{user ? user.name : "Tên người dùng"}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Username: {user ? user.username : "Không có"}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Email: {user ? user.email : "Không có"}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Số điện thoại: {user ? user.phoneNumber : "Không có"}</Card.Subtitle>
                            <Button variant="primary">Cập nhật thông tin</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
