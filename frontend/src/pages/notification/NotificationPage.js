import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications, markNotificationAsRead } from "../../redux/notificationSlice";
import { Card, Button, Badge, Spinner, Container, Row, Col, } from "react-bootstrap";
import { BellFill, CheckCircleFill } from "react-bootstrap-icons";
import Sidebar from "../../components/SideBar";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector((state) => state.notification);
    const { user } = useSelector((state) => state.auth); // Lấy user từ Redux store
    const userId = user?._id; // Đảm bảo lấy đúng ID người dùng

    useEffect(() => {
        if (userId) {
            dispatch(getUserNotifications(userId));
        }
    }, [dispatch, userId]);

    const unreadCount = notifications?.filter((noti) => !noti.is_read).length || 0;

    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
        window.location.reload();
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar user={user} />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="container mt-4">
                        <h1 className="d-flex align-items-center">
                            <BellFill className="me-2 text-primary" /> Thông Báo
                            {unreadCount > 0 && (
                                <Badge bg="danger" className="ms-2">
                                    {unreadCount} chưa đọc
                                </Badge>
                            )}
                        </h1>

                        {loading ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="text-center my-4">Bạn không có thông báo nào.</p>
                        ) : (
                            <div className="mt-3">
                                {notifications.map((noti) => (
                                    <Card key={noti._id} className={`mb-3 ${noti.read ? "border-secondary" : "border-primary"}`}>
                                        <Card.Body>
                                            <h5 className="card-title">{noti.title}</h5>
                                            <p className="card-text text-muted">{noti.message}</p>
                                            <p className="text-muted small">{new Date(noti.createdAt).toLocaleString()}</p>
                                            {!noti.is_read && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(noti._id)}
                                                >
                                                    <CheckCircleFill className="me-1" /> Đánh dấu đã đọc
                                                </Button>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );

};

export default NotificationPage;
