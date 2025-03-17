import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllServiceRequests,
    updateServiceRequest,
    deleteServiceRequest,
    addServiceOrderToApartment,
    removeServiceOrderFromApartment,
} from "../../redux/serviceSlice";
import { Container, Row, Col, Card, Button, Spinner, Table, Alert, Modal, Form } from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import { FaList, FaEdit, FaTrash } from "react-icons/fa";

const ServiceRequestPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { serviceRequests = [], loading, error } = useSelector(state => state.service);

    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        dispatch(getAllServiceRequests());
    }, [dispatch]);

    const handleShowModal = (request) => {
        setSelectedRequest(request);
        setStatus(request.status || "Pending"); // Đặt trạng thái mặc định nếu không có
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
        setStatus("");
    };

    const handleUpdateRequest = async () =>  {
        if (!selectedRequest) return;
        console.log(status);
        console.log("Selected Request:", selectedRequest);
        const requestData = {
            service_category_id: selectedRequest.service_category_id._id,
            user_id: selectedRequest.user_id._id,
            apartment_id: selectedRequest.apartment_id,
            status: status,
            note: selectedRequest.note || "",
            requested_date: selectedRequest.requested_date,
        };

        try {
            // Cập nhật yêu cầu dịch vụ
            await dispatch(updateServiceRequest({ id: selectedRequest._id, data: requestData })).unwrap();
            
            if (status === "Confirmed") await dispatch(addServiceOrderToApartment({id: selectedRequest._id, data: requestData })).unwrap();
            // Thêm đơn hàng vào căn hộ
            if (status === "Cancelled") await dispatch(removeServiceOrderFromApartment({id: selectedRequest._id, data: requestData })).unwrap();
    
            alert("Cập nhật thành công");
            handleCloseModal();
            dispatch(getAllServiceRequests()); // Load lại danh sách yêu cầu dịch vụ
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Lỗi khi cập nhật yêu cầu hoặc thêm đơn hàng!");
        }
    };
    

    const handleDeleteRequest = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) {
            dispatch(deleteServiceRequest(id));
        }
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar user={user} />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow">
                        <h1 className="h3 mb-0">
                            <FaList className="me-2" /> Quản lý Yêu cầu Dịch vụ
                        </h1>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                {loading && serviceRequests.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <Alert variant="danger">
                                        <strong>Lỗi!</strong> {error}
                                    </Alert>
                                ) : (
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Người yêu cầu</th>
                                                <th>Dịch vụ</th>
                                                <th>Ngày yêu cầu</th>
                                                <th>Trạng thái</th>
                                                <th className="text-end">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceRequests.length > 0 ? (
                                                serviceRequests.map(request => (
                                                    <tr key={request._id}>
                                                        <td>{request.user_id?.name || "Không xác định"}</td>
                                                        <td>{request.service_category_id?.name || "Không xác định"}</td>
                                                        <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                                                        <td>{request.status}</td>
                                                        <td className="text-end">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleShowModal(request)}
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteRequest(request._id)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5 text-muted">
                                                        Chưa có yêu cầu nào.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>
            </Row>

            {/* Modal Cập nhật Trạng thái */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái yêu cầu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select
                        value={status}
                        onChange={(e) => {
                            console.log("Trạng thái mới:", e.target.value); // Debug
                            setStatus(e.target.value);
                        }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="primary" onClick={handleUpdateRequest}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ServiceRequestPage;