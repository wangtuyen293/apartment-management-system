import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Table,
    Badge,
    Form,
    Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import { addApartment, getApartment } from "../../redux/apartmentSlice";
import Sidebar from "../../components/SideBar";
import { FaHome, FaList, FaUser, FaExclamationTriangle } from "react-icons/fa";

const ApartmentManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartment, loading, error } = useSelector((state) => state.apartment);
    const { user } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [apartmentData, setApartmentData] = useState({
        apartmentNumber: "",
        description: "",
        floor: "",
        area: "",
        price: "",
        images: []
    });

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApartmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setApartmentData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();
            Object.entries(apartmentData).forEach(([key, value]) => {
                if (key === 'images') {
                    value.forEach(image => formData.append('images', image));
                } else {
                    formData.append(key, value);
                }
            });

            const result = await dispatch(addApartment(formData)).unwrap();
            console.log('Apartment added successfully:', result);

            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            await dispatch(getApartment());
            setApartmentData({
                apartmentNumber: "",
                description: "",
                floor: "",
                area: "",
                price: "",
                images: []
            });
            setShowModal(false);
        } catch (error) {
            console.error('Error adding apartment:', error);
            alert('Có lỗi xảy ra khi thêm căn hộ');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Trống":
                return <Badge bg="success">Trống</Badge>;
            case "Đã cho thuê":
                return <Badge bg="danger">Đã cho thuê</Badge>;
            case "Khách hẹn xem":
                return <Badge bg="warning" text="dark">Khách hẹn xem</Badge>;
            case "Đã cọc":
                return <Badge bg="warning" text="dark">Đã cọc</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Sidebar />
                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow">
                        <h1 className="h3 mb-0">
                            <FaHome className="me-2" />
                            Quản lý Căn hộ
                        </h1>
                        <p className="mb-0 opacity-75">Danh sách yêu cầu thuê phòng</p>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 pt-4 pb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <FaList className="me-2 text-primary" />
                                        Danh sách khách yêu cầu thuê phòng
                                    </h5>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Thêm căn hộ
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <FaExclamationTriangle className="me-2" />
                                        <div>
                                            <strong>Lỗi!</strong> {error}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="border-0">Số phòng</th>
                                                    <th className="border-0">Tầng</th>
                                                    <th className="border-0">Tình trạng</th>
                                                    <th className="border-0">Người thuê</th>
                                                    <th className="border-0 text-end">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {apartment && apartment.length > 0 ? (
                                                    apartment.map((request) => (
                                                        <tr key={request._id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-light rounded-circle p-2 me-3">
                                                                        <FaHome className="text-primary" />
                                                                    </div>
                                                                    <strong>{request.apartmentNumber}</strong>
                                                                </div>
                                                            </td>
                                                            <td>{request.floor}</td>
                                                            <td>{getStatusBadge(request.status)}</td>
                                                            <td>
                                                                {request.tenantId ? (
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                                            <FaUser className="text-secondary" />
                                                                        </div>
                                                                        {request.tenantId.name}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted">N/A</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end">
                                                                <Button variant="outline-secondary" size="sm" className="me-2">
                                                                    Chi tiết
                                                                </Button>
                                                                <Button variant="primary" size="sm">
                                                                    Xử lý
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-5">
                                                            <div className="text-muted">
                                                                <p className="mb-0">Danh sách trống</p>
                                                                <small>Chưa có yêu cầu thuê phòng nào</small>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm mới căn hộ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Số căn hộ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apartmentNumber"
                                    value={apartmentData.apartmentNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={apartmentData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tầng</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="floor"
                                    value={apartmentData.floor}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Diện tích (m²)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="area"
                                    value={apartmentData.area}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá (VNĐ)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={apartmentData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Hình ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                {apartmentData.images.length > 0 && (
                                    <div className="mt-2">
                                        <p>Đã chọn {apartmentData.images.length} ảnh</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {apartmentData.images.map((image, index) => (
                                                <small key={index}>{image.name}</small>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Đang thêm..." : "Thêm căn hộ"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Row>
        </Container>
    );
};

export default ApartmentManagement;