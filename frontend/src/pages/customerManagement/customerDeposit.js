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
    HouseDoor,
    Gear,
    Person,
    Telephone,
    Calendar3,
    HandThumbsUp,
    HandThumbsDown,
    FileText,
    Clock
} from "react-bootstrap-icons";
import { getCustomerDeposit, ApproveRentApartment, RejectRentApartment } from '../../redux/residentSlice';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from "../../components/SideBar";

const CustomerDeposit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resident, loading, error } = useSelector(state => state.resident);

    useEffect(() => {
        dispatch(getCustomerDeposit());
    }, [dispatch]);

    console.log("Resident data:", resident);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <Badge bg="warning" text="dark">Đang chờ xử lý</Badge>;
            case 'Approved':
                return <Badge bg="success">Đã phê duyệt</Badge>;
            case 'Rejected':
                return <Badge bg="danger">Đã từ chối</Badge>;
            case 'Đã cọc':
                return <Badge bg="info">Đã cọc</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const getBillStatus = (id) => {
        const matchingBills = resident.bills?.filter(bill => (bill.apartment_id === id && bill.typeOfPaid === "Deposit")) || [];

        return matchingBills.length > 0
            ? `${matchingBills[0].status}`
            : 'Chưa thanh toán';
    };

    const getContract = (id) => {
        const matching = resident.contract?.filter(bill => (bill.apartment === id)) || [];
        console.log(matching)
        return matching[0].contractMonths;

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

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Sidebar />
                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="h3 mb-0">
                                    <HouseDoor className="me-2" />
                                    Quản lý khách đặt cọc phòng
                                </h1>
                                <p className="mb-0 opacity-75">Xử lý các yêu cầu cọc căn hộ từ khách hàng</p>
                            </div>
                            <div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="d-flex align-items-center"
                                    onClick={() => dispatch(getCustomerDeposit())}
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
                                    Danh sách cọc phòng
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
                                        <strong>Lỗi!</strong> {error}
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="mb-0 align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="px-4 py-3 border-0">Khách hàng</th>
                                                    <th className="py-3 border-0">Số phòng</th>
                                                    <th className="py-3 border-0">Trạng thái</th>
                                                    <th className="py-3 border-0">Ngày hẹn ký</th>
                                                    <th className="py-3 border-0">Thời hạn HĐ</th>
                                                    <th className="py-3 border-0">Thanh toán</th>
                                                    <th className="py-3 border-0 text-end pe-4">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resident?.users && resident.users.length > 0 ? (
                                                    resident.users.map((request) => (
                                                        <tr key={request._id}>
                                                            <td className="px-4 py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-light rounded-circle p-2 me-3">
                                                                        <Person className="text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="mb-0">{request.userId?.name || 'N/A'}</h6>
                                                                        <small className="text-muted d-flex align-items-center">
                                                                            <Telephone className="me-1" size={12} />
                                                                            {request.userId?.phoneNumber || 'N/A'}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <Badge bg="secondary">
                                                                    <HouseDoor className="me-1" />
                                                                    {request.apartment_id?.apartmentNumber || 'N/A'}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-3">
                                                                {getStatusBadge(request.status)}
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Calendar3 className="text-muted me-2" />
                                                                    {request.date ?
                                                                        new Date(request.date).toLocaleDateString('vi-VN') :
                                                                        'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Clock className="text-muted me-2" />
                                                                    <span>
                                                                        {getContract(request.apartment_id._id)} tháng
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="d-flex align-items-center">
                                                                    <Clock className="text-muted me-2" />
                                                                    <span>
                                                                        {getBillStatus(request.apartment_id._id)}
                                                                    </span>
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
                                                                        onClick={() => handleApprove(request._id, request.date, getContract(request.apartment_id._id))}
                                                                    >
                                                                        <HandThumbsUp className="me-1" /> Xác nhận
                                                                    </Button>
                                                                </OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip>Từ chối yêu cầu</Tooltip>}
                                                                >
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                    >
                                                                        <HandThumbsDown className="me-1" /> Hủy bỏ
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
                                                                <h5 className="text-muted">Không có khách cọc thuê phòng</h5>
                                                                <p className="text-muted mb-0">Chưa có khách hàng gửi yêu cầu cọc phòng nào.</p>
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

export default CustomerDeposit;