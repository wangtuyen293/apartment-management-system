import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Card, Button, Image } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded)
                setUser(decoded);
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

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                {/* Sidebar */}
                <Col xs={2} className="p-0 position-fixed" style={{ backgroundColor: "#F7444E", height: "100vh", top: 0, left: 0, display: "flex", flexDirection: "column" }}>
                    <Nav className="flex-column">
                        <Nav.Link href="/" className="d-flex align-items-center p-3 text-white">
                            <House className="me-2" /> Trang chủ
                        </Nav.Link>
                        <Nav.Link href="#" className="d-flex align-items-center p-3 text-white">
                            <Gear className="me-2" /> Dịch vụ
                        </Nav.Link>
                        <Nav.Link href="#" className="d-flex align-items-center p-3 text-white">
                            <CreditCard className="me-2" /> Thanh toán
                        </Nav.Link>
                        <Nav.Link href="#" className="d-flex align-items-center p-3 text-white">
                            <FileText className="me-2" /> Điều khoản
                        </Nav.Link>
                    </Nav>

                    {/* Sidebar Footer */}
                    <div className="text-center mt-auto p-3 text-white">
                        <Image src="" roundedCircle />
                        <p className="mt-2">{user ? user.username : "Người dùng"}</p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto" onClick={handleLogout}>
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
