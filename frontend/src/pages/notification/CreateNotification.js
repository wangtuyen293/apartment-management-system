import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApartment } from "../../redux/apartmentSlice";
import { createNotification } from "../../redux/notificationSlice";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import Sidebar from "../../components/SideBar";

const CreateNotification = () => {
    const dispatch = useDispatch();
    const { apartment } = useSelector((state) => state.apartment);
    const { loading } = useSelector((state) => state.notification);

    const [formData, setFormData] = useState({
        user_id: "", // Gửi cho tất cả nếu rỗng
        type: "general",
        title: "",
        message: "",
        metadata: {},
    });

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value.toString() });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("data:", formData)
        dispatch(createNotification(formData));
    };

    console.log("Apartment:", apartment);

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-4">
                    <h2 className="mb-4">Tạo Thông Báo</h2>

                    <Card className="p-4">
                        <Form onSubmit={handleSubmit}>
                            {/* Chọn căn hộ để gửi */}
                            <Form.Group className="mb-3">
                                <Form.Label>Gửi đến căn hộ</Form.Label>
                                <Form.Select name="user_id" value={formData.user_id} onChange={handleChange}>
                                    <option value="">Tất cả người dùng</option>
                                    {apartment
                                        .filter((apt) => apt.tenantId && apt.tenantId._id)
                                        .map((apartment) => (
                                            <option key={apartment._id} value={apartment.tenantId._id}>
                                                Phòng {apartment.apartmentNumber}
                                            </option>
                                        ))}
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
