import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Image, Badge, Dropdown, Nav, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import Sidebar from "../../components/SideBar";
import loginImage from '../../assets/images/fpt-login.jpg';
import {
    HandThumbsUp,
    Chat,
    Share,
    ThreeDotsVertical,
    Heart,
    Search,
    Bell,
    Person,
    PlusCircle
} from "react-bootstrap-icons";

const posts = [
    {
        id: 1,
        title: "Bài đăng 1",
        content: "Nội dung của bài đăng 1 với nhiều thông tin hữu ích cho người dùng. Đây là một bài viết hay với nhiều kiến thức chuyên môn.",
        author: "Admin",
        image: loginImage,
        likes: 42,
        comments: 7,
        shares: 3,
        timestamp: "2 giờ trước"
    },
    {
        id: 2,
        title: "Bài đăng 2",
        content: "Nội dung của bài đăng 2 với các thông tin về sự kiện sắp diễn ra. Hãy tham gia cùng chúng tôi để có thêm nhiều trải nghiệm mới.",
        author: "Admin",
        image: loginImage,
        likes: 28,
        comments: 5,
        shares: 2,
        timestamp: "5 giờ trước"
    },
    {
        id: 3,
        title: "Bài đăng 3",
        content: "Nội dung của bài đăng 3 giới thiệu về công nghệ mới nhất. Những xu hướng công nghệ đang phát triển mạnh mẽ trong thời gian gần đây.",
        author: "Admin",
        image: loginImage,
        likes: 35,
        comments: 6,
        shares: 1,
        timestamp: "1 ngày trước"
    },
];

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [likedPosts, setLikedPosts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");

    const { user, loading, error } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const toggleLike = (postId) => {
        setLikedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    return (
        <Container fluid style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <Row>

                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={10} className="p-4 ms-auto" style={{ marginLeft: "16.67%" }}>
                    {loading ? (
                        <div className="text-center my-5">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center my-5 text-danger">
                            <p>Lỗi: {error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex mb-4 justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0 fw-bold">Bảng tin</h5>
                                </div>
                                <div className="d-flex">
                                    {["all", "phổ biến", "mới nhất", "đã lưu"].map((filter) => (
                                        <Button
                                            key={filter}
                                            variant={activeFilter === filter ? "primary" : "outline-primary"}
                                            className="me-2 rounded-pill text-capitalize"
                                            size="sm"
                                            onClick={() => setActiveFilter(filter)}
                                        >
                                            {filter === "all" ? "Tất cả" : filter}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Row>
                                {posts.map(post => (
                                    <Col key={post.id} lg={4} md={6} className="mb-4">
                                        <Card
                                            className="h-100 border-0 shadow-sm rounded-3 overflow-hidden"
                                            style={{
                                                transition: "all 0.3s ease-in-out",
                                                transform: "translateY(0)",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-10px)';
                                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <div style={{ position: "relative", height: "180px" }}>
                                                <Image
                                                    src={post.image}
                                                    fluid
                                                    className="w-100 h-100"
                                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                                />
                                                <div
                                                    className="position-absolute top-0 end-0 p-2"
                                                    style={{ zIndex: 1 }}
                                                >
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="light"
                                                            id={`dropdown-${post.id}`}
                                                            className="rounded-circle"
                                                            size="sm"
                                                            style={{ width: "32px", height: "32px", padding: "0" }}
                                                        >
                                                            <ThreeDotsVertical />
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item>Xem chi tiết</Dropdown.Item>
                                                            <Dropdown.Item>Lưu bài viết</Dropdown.Item>
                                                            <Dropdown.Item>Báo cáo</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <Badge
                                                    bg="primary"
                                                    className="position-absolute bottom-0 start-0 m-3 rounded-pill px-3 py-2"
                                                >
                                                    Bài viết
                                                </Badge>
                                            </div>

                                            <Card.Body>
                                                <small className="text-muted d-block mb-2">{post.timestamp}</small>
                                                <Card.Title
                                                    className="mb-3 fw-bold"
                                                    style={{ fontSize: "1.1rem" }}
                                                >
                                                    {post.title}
                                                </Card.Title>

                                                <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                                                    {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                                                </Card.Text>

                                                <div className="d-flex align-items-center mb-3">
                                                    <Image
                                                        src={post.image}
                                                        roundedCircle
                                                        width={30}
                                                        height={30}
                                                        className="me-2"
                                                    />
                                                    <small className="text-muted">
                                                        Đăng bởi <span className="fw-bold">{post.author}</span>
                                                    </small>
                                                </div>

                                                <hr />

                                                <div className="d-flex justify-content-between">
                                                    <Button
                                                        variant={likedPosts.includes(post.id) ? "primary" : "light"}
                                                        size="sm"
                                                        className="d-flex align-items-center rounded-pill"
                                                        onClick={() => toggleLike(post.id)}
                                                    >
                                                        <HandThumbsUp className="me-1" />
                                                        <span>{post.likes}</span>
                                                    </Button>

                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="d-flex align-items-center rounded-pill"
                                                    >
                                                        <Chat className="me-1" />
                                                        <span>{post.comments}</span>
                                                    </Button>

                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="d-flex align-items-center rounded-pill"
                                                    >
                                                        <Share className="me-1" />
                                                        <span>{post.shares}</span>
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <div className="text-center mt-4">
                                <Button variant="outline-primary" className="rounded-pill px-4">
                                    Xem thêm
                                </Button>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;