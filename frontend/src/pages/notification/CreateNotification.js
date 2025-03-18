import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../redux/notificationSlice";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import Sidebar from "../../components/SideBar";

const CreateNotification = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.notification);
    const [formData, setFormData] = useState({
        user_id: "", // Rỗng nếu gửi cho tất cả user
        type: "general",
        title: "",
        message: "",
        metadata: {},
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNotification(formData));
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                {/* Sidebar */}
                <Col md={2} className="d-none d-md-block">
                    <Sidebar />
                </Col>

                {/* Nội dung */}
                <Col xs={12} md={10} className="ms-auto p-4">
                    <h2 className="mb-4">Tạo Thông Báo</h2>

                    <Card className="p-4">
                        <Form onSubmit={handleSubmit}>
                            {/* Chọn gửi cho tất cả hoặc 1 user */}
                            <Form.Group className="mb-3">
                                <Form.Label>Gửi đến</Form.Label>
                                <Form.Select name="user_id" value={formData.user_id} onChange={handleChange}>
                                    <option value="">Tất cả người dùng</option>
                                    <option value="67d6e846873eb98eed404cd6">User 123</option>
                                    <option value="67d6e846873eb98eed404cd6">User 456</option>
                                    {/* Cần fetch danh sách user nếu muốn chọn cụ thể */}
                                </Form.Select>
                            </Form.Group>

                            {/* Loại thông báo */}
                            <Form.Group className="mb-3">
                                <Form.Label>Loại Thông Báo</Form.Label>
                                <Form.Select name="type" value={formData.type} onChange={handleChange}>
                                    <option value="service_request">Yêu cầu dịch vụ</option>
                                    <option value="appointment">Cuộc hẹn</option>
                                    <option value="promotion">Khuyến mãi</option>
                                    <option value="general">Chung</option>
                                </Form.Select>
                            </Form.Group>

                            {/* Tiêu đề */}
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Nội dung */}
                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Nút gửi */}
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : "Gửi Thông Báo"}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateNotification;
