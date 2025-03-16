import React, { useEffect } from "react";
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
    InputGroup
} from "react-bootstrap";
import {
    Calendar3,
    Search,
    Eye,
    Person,
    Telephone,
    HouseDoor,
    Calendar2Check,
    InfoCircle,
    HandThumbsUp,
    HandThumbsDown
} from "react-bootstrap-icons";
import { getCustomerViewApartment, ApproveViewApartment, RejectViewApartment } from '../../redux/residentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../redux/authSlice";
import Sidebar from "../../components/SideBar";

const CustomerRequestView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resident, loading, error } = useSelector(state => state.resident);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getCustomerViewApartment());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <Badge bg="warning" text="dark">Đang chờ</Badge>;
            case 'Confirmed':
                return <Badge bg="success">Đã xác nhận</Badge>;
            case 'Cancelled':
                return <Badge bg="danger">Đã hủy</Badge>;
            default:
                return <Badge bg="secondary">Đang chờ</Badge>;
        }
    };

    const handleApprove = (id) => {
        dispatch(ApproveViewApartment(id))
            .then((resultAction) => {
                if (ApproveViewApartment.fulfilled.match(resultAction)) {
                    alert('Xác nhận thành công!');
                    getStatusBadge('Confirmed');
                    window.location.reload();
                } else if (ApproveViewApartment.rejected.match(resultAction)) {

                    console.error("Payment error:", resultAction.payload);
                }
            })
            .catch((error) => {
                console.error("Unexpected error:", error);
            });
    };

    const handleReject = (id) => {
        dispatch(RejectViewApartment(id))
            .then((resultAction) => {
                if (RejectViewApartment.fulfilled.match(resultAction)) {
                    alert('Từ chối thành công!');
                    getStatusBadge('Confirmed');
                    window.location.reload();
                } else if (RejectViewApartment.rejected.match(resultAction)) {

                    console.error("Payment error:", resultAction.payload);
                }
            })
            .catch((error) => {
                console.error("Unexpected error:", error);
            });
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={12} md={10} className="ms-auto p-0">
                    {/* Header */}
                    <div className="bg-info bg-gradient text-white py-4 px-4 shadow">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="h3 mb-0">
                                    <Calendar2Check className="me-2" />
                                    Lịch hẹn xem căn hộ
                                </h1>
                                <p className="mb-0 opacity-75">Quản lý các lịch hẹn xem phòng với khách hàng</p>
                            </div>
                            <div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => dispatch(getCustomerViewApartment())}
                                >
                                    <Eye className="me-1" /> Xem tất cả
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Container className="py-4">
                        {/* Search & Filter */}
                        <Card className="mb-4 border-0 shadow-sm">
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-light border-end-0">
                                                <Search />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Tìm kiếm theo tên khách hàng hoặc số phòng..."
                                                className="border-start-0 bg-light"
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={4}>
                                        <InputGroup>
                                            <InputGroup.Text className="bg-light border-end-0">
                                                <Calendar3 />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="date"
                                                className="border-start-0 bg-light"
                                            />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Main Content */}
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white py-3 border-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 text-info">
                                        <Calendar2Check className="me-2" />
                                        Danh sách khách hẹn xem phòng
                                    </h5>
                                    <div>
                                        <Badge bg="secondary" className="me-2">Tổng: {resident ? resident.length : 0}</Badge>
                                        <Button variant="outline-info" size="sm">
                                            <Calendar3 className="me-1" /> Lịch tháng
                                        </Button>
                                    </div>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="info" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu lịch hẹn...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger m-4" role="alert">
                                        <InfoCircle className="me-2" />
                                        <strong>Lỗi!</strong> {error}
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-4 py-3 border-0">Khách hàng</th>
                                                    <th className="py-3 border-0">Căn hộ</th>
                                                    <th className="py-3 border-0">Trạng thái</th>
                                                    <th className="py-3 border-0">Ngày xem</th>
                                                    <th className="py-3 border-0 text-end pe-4">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resident && resident.length > 0 ? (
                                                    resident.map((request) => (
                                                        <tr key={request._id}>
                                                            <td className="px-4 py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                                                        <Person className="text-info" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0">{request.userId.name}</h6>
                                                                        <small className="text-muted d-flex align-items-center">
                                                                            <Telephone className="me-1" size={12} />
                                                                            {request.userId.phoneNumber}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-secondary bg-opacity-10 rounded p-1 me-2">
                                                                        <HouseDoor className="text-secondary" />
                                                                    </div>
                                                                    <span>Phòng {request.apartment_id.apartmentNumber}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                {getStatusBadge()}
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Calendar3 className="text-muted me-2" />
                                                                    <div>
                                                                        <div>{formatDate(request.date)}</div>
                                                                        <small className="text-muted">
                                                                            {new Date(request.date).toLocaleTimeString('vi-VN', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 text-end pe-4">
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => handleApprove(request._id)}
                                                                >
                                                                    <HandThumbsUp className="me-1" /> Đồng ý
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleReject(request._id)}
                                                                >
                                                                    <HandThumbsDown className="me-1" /> Từ chối
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-5">
                                                            <div className="py-4">
                                                                <Calendar2Check size={40} className="text-muted mb-3" />
                                                                <h5 className="text-muted">Không có lịch hẹn</h5>
                                                                <p className="text-muted mb-0">Hiện tại chưa có khách hàng nào đặt lịch hẹn xem phòng.</p>
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
            </Row>
        </Container>
    );
};

export default CustomerRequestView;