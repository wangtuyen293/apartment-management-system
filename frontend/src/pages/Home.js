import React from "react";
import { Container, Row, Col, Nav, Card, Button, Image } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, Chat, Share } from "react-bootstrap-icons";
import loginImage from "../assets/fpt-login.jpg";

const posts = [
    { id: 1, title: "Bài đăng 1", content: "Nội dung của bài đăng 1...", author: "Admin", image: loginImage },
    { id: 2, title: "Bài đăng 2", content: "Nội dung của bài đăng 2...", author: "Admin", image: loginImage },
    { id: 3, title: "Bài đăng 3", content: "Nội dung của bài đăng 3...", author: "Admin", image: loginImage },
];

const styles = {
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "16.67%",
        height: "100vh",
        backgroundColor: "#F7444E",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        color: "black",
        textDecoration: "none"
    },
    sidebarFooter: {
        marginTop: "auto",
        textAlign: "center",
        borderTop: "1px solid #ddd",
        paddingTop: "1rem"
    },
    content: {
        marginLeft: "16.67%",
        width: "83.33%",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
};

const HomePage = () => {
    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <Nav className="flex-column">
                        <Nav.Link href="#" style={styles.sidebarLink}>
                            <House className="me-2" /> Trang chủ
                        </Nav.Link>
                        <Nav.Link href="#" style={styles.sidebarLink}>
                            <Gear className="me-2" /> Dịch vụ
                        </Nav.Link>
                        <Nav.Link href="#" style={styles.sidebarLink}>
                            <CreditCard className="me-2" /> Thanh toán
                        </Nav.Link>
                        <Nav.Link href="#" style={styles.sidebarLink}>
                            <FileText className="me-2" /> Điều khoản
                        </Nav.Link>
                    </Nav>

                    {/* Sidebar Footer */}
                    <div style={styles.sidebarFooter}>
                        <Image src="" roundedCircle />
                        <p className="mt-2">Người dùng</p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto">
                            <BoxArrowRight className="me-2" /> Đăng xuất
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <Col style={styles.content}>
                    {posts.map(post => (
                        <Card key={post.id} className="mb-3 w-50">
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
