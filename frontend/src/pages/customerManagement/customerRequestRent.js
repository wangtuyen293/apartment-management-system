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
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import {
    House,
    Gear,
    CreditCard,
    FileText,
    BoxArrowRight,
    HandThumbsUp,
    HandThumbsDown,
    HouseDoor,
    Calendar3,
    Telephone,
    Person,
    FileEarmarkText,
    Clock
} from "react-bootstrap-icons";
import { getCustomerRequestRentApartment, ApproveRentApartment, RejectRentApartment } from '../../redux/residentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../redux/authSlice";
import Sidebar from "../../components/SideBar";

const CustomerRequestRent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resident, loading, error } = useSelector(state => state.resident);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getCustomerRequestRentApartment());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handleApprove = (requestId, date, duration) => {
        dispatch(ApproveRentApartment({ requestId, date, duration })).then((resultAction) => {
            if (ApproveRentApartment.fulfilled.match(resultAction)) {
                alert('Xác nhận thành công!');
                getStatusBadge('Confirmed');
                window.location.reload();
            } else if (ApproveRentApartment.rejected.match(resultAction)) {
                console.error("Payment error:", resultAction.payload);
            }
        })
            .catch((error) => {
                console.error("Unexpected error:", error);
            });
    };

    const handleReject = (requestId) => {
        dispatch(RejectRentApartment(requestId));
        window.location.reload();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <Badge bg="warning" text="dark">Đang chờ xử lý</Badge>;
            case 'Approved':
                return <Badge bg="success">Đã phê duyệt</Badge>;
            case 'Rejected':
                return <Badge bg="danger">Đã từ chối</Badge>;
            default:
                return <Badge bg="info">{status}</Badge>;
        }
    };
    console.log(resident);
    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="h3 mb-0">
                                    <HouseDoor className="me-2" />
                                    Quản lý Yêu cầu Thuê phòng
                                </h1>
                                <p className="mb-0 opacity-75">Xử lý các yêu cầu thuê căn hộ từ khách hàng</p>
                            </div>
                            <div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="d-flex align-items-center"
                                    onClick={() => dispatch(getCustomerRequestRentApartment())}
                                >
                                    <Gear className="me-2" />
                                    Làm mới
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                                <h5 className="mb-0 text-primary">
                                    <FileText className="me-2" />
                                    Danh sách yêu cầu thuê phòng
                                </h5>
                            </Card.Header>

                            <Card.Body className="p-0">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger m-4" role="alert">
                                        <strong>Danh sách trống!</strong> {error}
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="mb-0 align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-4 py-3 border-0">Khách hàng</th>
                                                    <th className="py-3 border-0">Số phòng</th>
                                                    <th className="py-3 border-0">Trạng thái</th>
                                                    <th className="py-3 border-0">Ngày vào</th>
                                                    <th className="py-3 border-0">Thời hạn</th>
                                                    <th className="py-3 border-0 text-end pe-4">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resident && resident.length > 0 ? (
                                                    resident.map((request) => (
                                                        <tr key={request._id}>
                                                            <td className="px-4 py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-light rounded-circle p-2 me-3">
                                                                        <Person className="text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0">{request.username}</h6>
                                                                        <small className="text-muted d-flex align-items-center">
                                                                            <Telephone className="me-1" size={12} />
                                                                            {request.phoneNumber}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <Badge bg="secondary">
                                                                    <HouseDoor className="me-1" />
                                                                    {request.apartment}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3">
                                                                {getStatusBadge(request.status)}
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Calendar3 className="text-muted me-2" />
                                                                    {new Date(request.date).toLocaleDateString('vi-VN')}
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Clock className="text-muted me-2" />
                                                                    <span>{request.contractMonths} tháng</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 text-end pe-4">
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip>Phê duyệt yêu cầu</Tooltip>}
                                                                >
                                                                    <Button
                                                                        variant="success"
                                                                        size="sm"
                                                                        className="me-2"
                                                                        onClick={() => handleApprove(request._id, request.date, request.contractMonths)}
                                                                        disabled={request.action === "Đồng ý" || request.action === "Từ chối"}
                                                                    >
                                                                        <HandThumbsUp className="me-1" /> Phê duyệt
                                                                    </Button>
                                                                </OverlayTrigger>

                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip>Từ chối yêu cầu</Tooltip>}
                                                                >
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleReject(request._id)}
                                                                        disabled={request.action === "Đồng ý" || request.action === "Từ chối"}
                                                                    >
                                                                        <HandThumbsDown className="me-1" /> Từ chối
                                                                    </Button>
                                                                </OverlayTrigger>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-5">
                                                            <div className="py-4">
                                                                <HouseDoor size={40} className="text-muted mb-3" />
                                                                <h5 className="text-muted">Không có yêu cầu thuê phòng</h5>
                                                                <p className="text-muted mb-0">Chưa có khách hàng gửi yêu cầu thuê phòng nào.</p>
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

export default CustomerRequestRent;