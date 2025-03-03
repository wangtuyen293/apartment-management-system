import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Nav, Card, Button, Image, NavDropdown } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, Chat, Share, HouseDoor } from "react-bootstrap-icons";
import loginImage from "../../assets/fpt-login.jpg";
import { getUser, logout } from "../../redux/authSlice";
import { jwtDecode } from "jwt-decode";
const posts = [
    { id: 1, title: "Bài đăng 1", content: "Nội dung của bài đăng 1...", author: "Admin", image: loginImage },
    { id: 2, title: "Bài đăng 2", content: "Nội dung của bài đăng 2...", author: "Admin", image: loginImage },
    { id: 3, title: "Bài đăng 3", content: "Nội dung của bài đăng 3...", author: "Admin", image: loginImage },
];

const HomePage = () => {
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector((state) => state.auth);

    console.log(user);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.user.role);
                setUserName(decoded.user.username);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("accessToken");
        setUserName(null);
        setRole(null);
        navigate("/");
    }, [navigate]);

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                {/* Sidebar */}
                <Col xs={2} className="p-0 position-fixed" style={{ background: "linear-gradient(180deg, #FF4F70, #FF1A55)", height: "100vh", top: 0, left: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #ddd" }}>
                    <Nav className="flex-column">
                        {/* Conditional rendering for Admin and User */}
                        {role === "Admin" ? (
                            <>
                                <Nav.Link href="/home" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <House className="me-2 fs-5" /> Bảng tin
                                </Nav.Link>
                                <Nav.Link href="/apartment-manage" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Tòa nhà
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Phí dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Ghi chỉ số
                                </Nav.Link>
                                <NavDropdown title={<span className="d-flex align-items-center text-white fs-5"><HandThumbsUp className="me-2" /> Khách hàng</span>} id="customer-nav-dropdown" className="text-white">
                                    <NavDropdown.Item href="/customer/view">Khách hẹn xem</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã cọc</NavDropdown.Item>
                                    <NavDropdown.Item href="/customer/rent">Khách yêu cầu thuê</NavDropdown.Item>
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
                            {userName}
                        </p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto" onClick={handleLogout} style={{ borderRadius: "30px", padding: "0.5rem 1.5rem" }}>
                            <BoxArrowRight className="me-2" /> Đăng xuất
                        </Button>
                    </div>
                </Col>

                {/* Content */}
                <Col xs={10} className="p-5 ms-auto" style={{ marginLeft: "16.67%" }}>
                    {loading ? (
                        <p>Loading user data...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        posts.map(post => (
                            <Card key={post.id} className="mb-4 w-75 mx-auto" style={{ borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s ease-in-out" }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <Card.Body className="text-center">
                                    <Card.Title style={{ fontWeight: "600", fontSize: "1.25rem" }}>{post.title}</Card.Title>
                                    <Image src={post.image} fluid className="mb-3" style={{ borderRadius: "10px" }} />
                                    <Card.Text>{post.content}</Card.Text>
                                    <Card.Subtitle className="text-muted mb-2">Đăng bởi: {post.author}</Card.Subtitle>
                                    <div className="d-flex justify-content-center gap-3">
                                        <Button variant="outline-primary" className="d-flex align-items-center" style={{ borderRadius: "30px" }}>
                                            <HandThumbsUp className="me-2" /> Thích
                                        </Button>
                                        <Button variant="outline-secondary" className="d-flex align-items-center" style={{ borderRadius: "30px" }}>
                                            <Chat className="me-2" /> Bình luận
                                        </Button>
                                        <Button variant="outline-success" className="d-flex align-items-center" style={{ borderRadius: "30px" }}>
                                            <Share className="me-2" /> Chia sẻ
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;