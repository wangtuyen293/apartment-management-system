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
    OverlayTrigger,
    Tooltip,
    Form,
    Modal
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
    Clock,
    Search,
    Funnel,
    Cash,
    Lightning,
    Droplet,
    Building
} from "react-bootstrap-icons";
import { getAllResidents, updateIndex, sendBill } from '../../redux/residentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../redux/authSlice";
import Sidebar from "../../components/SideBar";

const FeeManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resident, loading, error } = useSelector(state => state.resident);
    const { user } = useSelector(state => state.auth);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showIndexModal, setShowIndexModal] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [newElectron, setNewElectron] = useState('');
    const [newWater, setNewWater] = useState('');
    const [month, setMonth] = useState('');

    useEffect(() => {
        dispatch(getAllResidents());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handlePaymentModal = (residentInfo) => {
        setSelectedResident(residentInfo);
        setShowPaymentModal(true);
    };

    const handleStatusFilter = (status) => {
        setFilterStatus(status);
    };

    const handleIndexModal = (residentInfo) => {
        setSelectedResident(residentInfo);
        setShowIndexModal(true);
    };


    const getStatusBadge = (fee) => {
        if (!fee || fee === 0 || fee === "Paid") {
            return <Badge bg="success">Đã thanh toán</Badge>;
        }
        return <Badge bg="danger">Chưa thanh toán</Badge>;
    };


    const handleUpdateIndex = () => {
        console.log("Sending data:", {
            apartmentId: selectedResident.apartment?._id,
            electron: newElectron,
            water: newWater,
            date: month
        });
        dispatch(updateIndex({
            apartmentId: selectedResident.apartment?._id,
            electron: newElectron,
            water: newWater,
            date: month
        }))
            .then(() => {
                setNewElectron('');
                setNewWater('');
                setShowIndexModal(false);
                dispatch(getAllResidents());
            })
            .catch((error) => {
                console.error('Update failed:', error);
            });
    };

    const handleSendBill = (id) => {
        const action = dispatch(sendBill({ id }));

        action
            .then((result) => {
                console.log("Action fulfilled:", result);
                window.alert('Send bill for user success');
                setShowPaymentModal(false);
                dispatch(getAllResidents());
            })
            .catch((error) => {
                console.error('Action rejected:', error);
                window.alert('Failed to send bill: ' + (error.message || 'Unknown error'));
            });

        console.log("Action dispatched (pending):", action);
    };
    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={12} md={10} className="ms-auto p-3">
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">
                                    <CreditCard className="me-2" /> Quản lý phí
                                </h4>
                                <Button variant="light" size="sm">
                                    <FileEarmarkText className="me-1" /> Xuất báo cáo
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group className="d-flex">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tìm kiếm theo tên cư dân..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Button variant="outline-primary" className="ms-2">
                                            <Search />
                                        </Button>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="d-flex justify-content-end">
                                    <Button
                                        variant={filterStatus === "all" ? "primary" : "outline-primary"}
                                        className="me-2"
                                        onClick={() => handleStatusFilter("all")}
                                    >
                                        Tất cả
                                    </Button>
                                    <Button
                                        variant={filterStatus === "paid" ? "success" : "outline-success"}
                                        className="me-2"
                                        onClick={() => handleStatusFilter("paid")}
                                    >
                                        <HandThumbsUp className="me-1" /> Đã thanh toán
                                    </Button>
                                    <Button
                                        variant={filterStatus === "unpaid" ? "danger" : "outline-danger"}
                                        onClick={() => handleStatusFilter("unpaid")}
                                    >
                                        <HandThumbsDown className="me-1" /> Chưa thanh toán
                                    </Button>
                                </Col>
                            </Row>

                            {loading ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Đang tải dữ liệu...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center p-5">
                                    <p className="text-danger">Đã xảy ra lỗi: {error}</p>
                                    <Button variant="primary" onClick={() => dispatch(getAllResidents())}>
                                        Thử lại
                                    </Button>
                                </div>
                            ) : resident?.length === 0 ? (
                                <div className="text-center p-5">
                                    <HouseDoor size={48} className="text-muted mb-3" />
                                    <h5>Không tìm thấy dữ liệu cư dân phù hợp</h5>
                                    {searchTerm && (
                                        <p>Không có kết quả phù hợp với "{searchTerm}"</p>
                                    )}
                                </div>
                            ) : (
                                <Table responsive hover striped>
                                    <thead>
                                        <tr>
                                            <th>Căn hộ</th>
                                            <th>
                                                <Lightning className="me-1" />Số Điện Hiện Tại
                                            </th>
                                            <th>
                                                <Lightning className="me-1" />Số Điện Của Tháng
                                            </th>
                                            <th>
                                                <Droplet className="me-1" /> Số Nước Hiện Tại
                                            </th>
                                            <th>
                                                <Droplet className="me-1" /> Số Nước Của Tháng
                                            </th>
                                            <th>
                                                Thời gian ghi số
                                            </th>
                                            <th>Xử lý</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resident?.map((residentInfo, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="fw-bold">
                                                        <Person className="me-1" />
                                                        {residentInfo.apartment ? residentInfo.apartment.apartmentNumber : "Không có thông tin"}
                                                    </div>
                                                </td>
                                                <td>
                                                    {residentInfo.fees.electron_current ? (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip>
                                                                    {residentInfo.fees.electron_current > 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div>
                                                                {residentInfo.fees.electron_current}
                                                            </div>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <span className="text-muted">0</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {residentInfo.fees.electron_month ? (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip>
                                                                    {residentInfo.fees.electron_month > 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div>
                                                                {residentInfo.fees.electron_month || 0}
                                                            </div>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <span className="text-muted">0</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {residentInfo.fees.water_current ? (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip>
                                                                    {residentInfo.fees.water_current > 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div>
                                                                {residentInfo.fees.water_current || 0}
                                                            </div>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <span className="text-muted">0 </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {residentInfo.fees.water_month ? (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip>
                                                                    {residentInfo.fees.water_month > 0 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div>
                                                                {residentInfo.fees.water_month || 0}
                                                            </div>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <span className="text-muted">0 </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {residentInfo.day
                                                        ? new Date(residentInfo.day).toLocaleDateString("vi-VN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handlePaymentModal(residentInfo)}
                                                    >
                                                        <CreditCard className="me-1" /> Gửi bill
                                                    </Button>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleIndexModal(residentInfo)}
                                                    >
                                                        <CreditCard className="me-1" /> Ghi chỉ số
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    <Clock className="me-1" /> Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                                </small>
                                <div>
                                    <small>Tổng số cư dân: {resident?.length || 0}</small>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>

                    <Row>
                        <Col md={4}>
                            <Card className="shadow-sm mb-3">
                                <Card.Body className="text-center">
                                    <Lightning size={30} className="text-warning mb-2" />
                                    <h5>Phí điện</h5>
                                    <h3 className="text-warning">
                                        350đ/chỉ số
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm mb-3">
                                <Card.Body className="text-center">
                                    <Droplet size={30} className="text-info mb-2" />
                                    <h5>Phí nước</h5>
                                    <h3 className="text-info">
                                        120đ/khối nước
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm mb-3">
                                <Card.Body className="text-center">
                                    <Building size={30} className="text-primary mb-2" />
                                    <h5>Phí quản lý</h5>
                                    <h3 className="text-primary">
                                        5000đ/tháng
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {selectedResident && (
                <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <CreditCard className="me-2" /> Gửi Bill Cho Khách Hàng
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <>
                            <div className="mb-3">
                                <p className="fw-bold">Cư dân: {selectedResident.resident?.name}</p>
                                <hr />
                            </div>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Loại phí</th>
                                        <th>Chỉ số</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Lightning className="me-1 text-warning" /> Điện
                                        </td>
                                        <td>{selectedResident.fees.electron_month || 0}</td>
                                        <td>{selectedResident.fees.electron_month * 350 || 0} VND</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Droplet className="me-1 text-info" /> Nước
                                        </td>
                                        <td>{selectedResident.fees.water_month || 0}</td>
                                        <td>{selectedResident.fees.water_month * 120 || 0} VND</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Building className="me-1 text-primary" /> Quản lý
                                        </td>
                                        <td>5000 VND</td>
                                        <td>5000 VND</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Building className="me-1 text-primary" /> Phí căn hộ
                                        </td>
                                        <td>{selectedResident.apartment.price}</td>
                                        <td>{selectedResident.apartment.price} VND</td>
                                    </tr>
                                    <tr className="table-active">
                                        <td colSpan="2" className="fw-bold">Tổng cộng</td>
                                        <td className="fw-bold">{selectedResident.fees.electron_month * 350 + selectedResident.fees.water_month * 120 + selectedResident.apartment.price + 5000} VND</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => handleSendBill(selectedResident.apartment._id)}
                        >
                            <Cash className="me-1" /> Xác nhận gửi
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Modal show={showIndexModal} onHide={() => setShowIndexModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <CreditCard className="me-2" /> Ghi chỉ số
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedResident && (
                        <>
                            <div className="mb-3">
                                <p className="fw-bold">
                                    Cư dân: {selectedResident.resident?.name || 'Không xác định'}
                                </p>
                                <hr />
                            </div>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Loại</th>
                                        <th>Số hiện tại</th>
                                        <th>Số mới</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Lightning className="me-1 text-warning" /> Điện
                                        </td>
                                        <td>{selectedResident.fees?.electron_current || 0}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={newElectron}
                                                onChange={(e) => setNewElectron(e.target.value)}
                                                placeholder="Nhập số mới"
                                                min="0"
                                                step="1"
                                                required="true"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Droplet className="me-1 text-info" /> Nước
                                        </td>
                                        <td>{selectedResident.fees?.water_current || 0}</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={newWater}
                                                onChange={(e) => setNewWater(e.target.value)}
                                                placeholder="Nhập số mới"
                                                min="0"
                                                step="1"
                                                required="true"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            Ngày ghi số
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                                required="true"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIndexModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleUpdateIndex}
                        disabled={!newElectron || !newWater || !month}
                    >
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>


        </Container>
    );
};

export default FeeManagement;