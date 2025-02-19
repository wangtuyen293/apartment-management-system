import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Card, Button, Image } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, Chat, Share } from "react-bootstrap-icons";
import loginImage from "../assets/fpt-login.jpg";
import { jwtDecode } from "jwt-decode";

const posts = [
    { id: 1, title: "Bài đăng 1", content: "Nội dung của bài đăng 1...", author: "Admin", image: loginImage },
    { id: 2, title: "Bài đăng 2", content: "Nội dung của bài đăng 2...", author: "Admin", image: loginImage },
    { id: 3, title: "Bài đăng 3", content: "Nội dung của bài đăng 3...", author: "Admin", image: loginImage },
];

const HomePage = () => {
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.username);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserName(null);
        navigate("/");
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                {/* Sidebar */}
                <Col xs={2} className="p-0 position-fixed" style={{ backgroundColor: "#F7444E", height: "100vh", top: 0, left: 0, display: "flex", flexDirection: "column" }}>
                    <Nav className="flex-column">
                        <Nav.Link href="#" className="d-flex align-items-center p-3 text-white">
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
                        <p className="mt-2" onClick={handleProfileRedirect} style={{ cursor: "pointer" }}>
                            {userName ? userName : "Người dùng"}
                        </p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto" onClick={handleLogout}>
                            <BoxArrowRight className="me-2" /> Đăng xuất
                        </Button>
                    </div>
                </Col>

                {/* Content */}
                <Col xs={10} className="p-5 ms-auto" style={{ marginLeft: "16.67%" }}>
                    {posts.map(post => (
                        <Card key={post.id} className="mb-3 w-50 mx-auto">
                            <Card.Body className="text-center">
                                <Card.Title>{post.title}</Card.Title>
                                <Image src={post.image} fluid className="mb-3" />
                                <Card.Text>{post.content}</Card.Text>
                                <Card.Subtitle className="text-muted mb-2">Đăng bởi: {post.author}</Card.Subtitle>
                                <div className="d-flex justify-content-center gap-3">
                                    <Button variant="outline-primary" className="d-flex align-items-center">
                                        <HandThumbsUp className="me-2" /> Thích
                                    </Button>
                                    <Button variant="outline-secondary" className="d-flex align-items-center">
                                        <Chat className="me-2" /> Bình luận
                                    </Button>
                                    <Button variant="outline-success" className="d-flex align-items-center">
                                        <Share className="me-2" /> Chia sẻ
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
