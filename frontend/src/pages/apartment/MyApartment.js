import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApartment } from "../../redux/apartmentSlice";
import { createServiceRequest, getAllServiceCategories, getAllServiceRequests } from "../../redux/serviceSlice";
import { Container, Row, Col, Card, Button, Spinner, Table, Alert, Modal, Form } from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import { FaBuilding } from "react-icons/fa";

const MyApartmentPage = () => {
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux store
    const { user } = useSelector(state => state.auth);
    const { apartment, loading, error } = useSelector(state => state.apartment);
    const { serviceCategories = [], serviceRequests } = useSelector(state => state.service);

    // State modal
    const [showModal, setShowModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [note, setNote] = useState("");
    const [requestedDate, setRequestedDate] = useState("");

    useEffect(() => {
        dispatch(getApartment());
        dispatch(getAllServiceCategories()); // Lấy danh mục dịch vụ
        dispatch(getAllServiceRequests());
    }, [dispatch]);

    const userApartments = apartment?.filter(apartment => apartment.tenantId?._id === user?._id) || [];
    const userRequest = serviceRequests?.filter(req => req?.user_id?._id === user?._id);
    console.log(userRequest)

    // Mở modal
    const handleShowModal = (apartment) => {
        setSelectedApartment(apartment);
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedApartment(null);
        setSelectedCategory("");
        setNote("");
        setRequestedDate("");
    };

    // Gửi yêu cầu dịch vụ
    const handleRequestService = () => {
        if (!selectedCategory || !requestedDate) {
            alert("Vui lòng chọn dịch vụ và ngày yêu cầu!");
            return;
        }

        const requestData = {
            service_category_id: selectedCategory,
            user_id: user._id,
            apartment_id: selectedApartment._id,
            status: "Pending",
            note,
            requested_date: requestedDate
        };

        console.log(requestData);

        dispatch(createServiceRequest(requestData))
            .then(() => {
                alert("Yêu cầu dịch vụ đã được gửi!");
                handleCloseModal();
            })
            .catch(err => {
                alert("Lỗi khi gửi yêu cầu!");
                console.error(err);
            });
    };

    const formatDay = (day) => {
        const date = new Date(day);
        return date.toLocaleDateString('vi-VN');
    }

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar user={user} />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow">
                        <h1 className="h3 mb-0">
                            <FaBuilding className="me-2" /> Danh sách dịch vụ
                        </h1>
                        <p className="mb-0 opacity-75">Quản lý các dịch vụ bạn yêu cầu</p>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">

                            <Card.Body>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <Alert variant="danger">
                                        <strong>Lỗi!</strong> {error}
                                    </Alert>
                                ) : userRequest.length > 0 ? (
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Người thuê</th>
                                                <th>Số phòng</th>
                                                <th>Loại dịch vụ</th>
                                                <th>Ngày sửa</th>
                                                <th>Tình trạng</th>
                                                <th className="text-end">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userRequest.map(apartment => (
                                                <tr key={apartment._id}>
                                                    <td>{apartment.user_id?.name || "Chưa có chủ sỡ hữu"}</td>
                                                    <td>{apartment.apartment_id?.apartmentNumber}</td>
                                                    <td>{apartment.service_category_id.name}</td>
                                                    <td>{formatDay(apartment.requested_date)}</td>
                                                    <td>{apartment.status}</td>
                                                    <td className="text-end">
                                                        <Button variant="primary" size="sm" onClick={() => handleShowModal(apartment.apartment_id)}>
                                                            Yêu cầu dịch vụ
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-5 text-muted">Bạn chưa có căn hộ nào.</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Yêu cầu dịch vụ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn dịch vụ</Form.Label>
                            <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">-- Chọn dịch vụ --</option>
                                {serviceCategories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control as="textarea" value={note} onChange={(e) => setNote(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ngày yêu cầu</Form.Label>
                            <Form.Control type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="primary" onClick={handleRequestService}>Gửi yêu cầu</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyApartmentPage;