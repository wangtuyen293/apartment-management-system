import React, { useState } from "react";
import {
    Container, Row, Col, Nav, Card, Button, Image, Navbar,
    Tab, Tabs, Badge, ListGroup, Table, Form
} from "react-bootstrap";
import {
    House, Gear, CreditCard, FileText, BoxArrowRight,
    HandThumbsUp, Chat, Share, HouseDoor, Bell, Calendar
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loginImage from '../../assets/images/fpt-login.jpg';
import { logoutUser } from "../../redux/authSlice";
import Sidebar from "../../components/SideBar";

const UserProfilePage = () => {
    const { user, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState("profile");
    console.log(user)

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const renderContent = () => {
        switch (activeSection) {
            case "profile":
                return <ProfileSection user={user} />;
            case "transactions":
                return <TransactionsSection />;
            case "contracts":
                return <ContractsSection />;
            default:
                return <ProfileSection user={user} />;
        }
    };

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>

                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={10} className="p-0 ms-auto" style={{ marginLeft: "16.67%" }}>

                    <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
                        <Container fluid className="px-4 py-2">
                            <Navbar.Brand className="fs-4 fw-bold">Tài khoản của tôi</Navbar.Brand>
                            <Nav className="ms-auto">
                                <Nav.Link
                                    className={`mx-2 ${activeSection === "profile" ? "text-primary fw-bold" : ""}`}
                                    onClick={() => setActiveSection("profile")}
                                >
                                    <House className="me-1" />
                                    Hồ sơ người dùng
                                </Nav.Link>
                                <Nav.Link
                                    className={`mx-2 ${activeSection === "transactions" ? "text-primary fw-bold" : ""}`}
                                    onClick={() => setActiveSection("transactions")}
                                >
                                    <CreditCard className="me-1" />
                                    Lịch sử giao dịch
                                </Nav.Link>
                                <Nav.Link
                                    className={`mx-2 ${activeSection === "contracts" ? "text-primary fw-bold" : ""}`}
                                    onClick={() => setActiveSection("contracts")}
                                >
                                    <FileText className="me-1" />
                                    Hợp đồng căn hộ
                                </Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>

                    <Container fluid className="px-4 pb-4">
                        {renderContent()}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

const ProfileSection = ({ user }) => {
    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Thông tin cá nhân</h4>
                    <Button variant="primary">
                        <Gear className="me-2" />
                        Cập nhật thông tin
                    </Button>
                </div>

                <Row>
                    <Col md={4} className="mb-4 text-center">
                        <div className="position-relative mb-3 mx-auto" style={{ width: "150px", height: "150px" }}>
                            <Image
                                src={user?.avatar || loginImage}
                                roundedCircle
                                className="border border-3 border-white shadow-sm"
                                width="150"
                                height="150"
                                style={{ objectFit: "cover" }}
                            />
                            <Button
                                variant="light"
                                size="sm"
                                className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow-sm"
                            >
                                <Gear size={16} />
                            </Button>
                        </div>
                        <h5 className="mb-1">{user?.username || "Tên người dùng"}</h5>
                        <p className="text-muted">{user?.email || "email@example.com"}</p>
                    </Col>
                    <Col md={8}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-muted">Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.name || ""}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-muted">Tên người dùng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.username || ""}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-muted">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-muted">Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={user?.phoneNumber || ""}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="text-muted">Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.address || ""}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex mt-3">
                            <Button variant="outline-secondary" className="me-2">
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

// Transactions Section Component
const TransactionsSection = () => {
    const transactions = [
        { id: 1, date: "01/03/2025", type: "Thanh toán tiền thuê", amount: "9,500,000", status: "Thành công" },
        { id: 2, date: "01/02/2025", type: "Thanh toán tiền điện", amount: "1,200,000", status: "Thành công" },
        { id: 3, date: "01/02/2025", type: "Thanh toán tiền nước", amount: "350,000", status: "Thành công" },
        { id: 4, date: "01/01/2025", type: "Thanh toán tiền thuê", amount: "9,500,000", status: "Thành công" },
        { id: 5, date: "15/12/2024", type: "Đặt cọc", amount: "19,000,000", status: "Thành công" },
    ];

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Lịch sử giao dịch</h4>
                    <div>
                        <Form.Select className="d-inline-block me-2" style={{ width: "150px" }}>
                            <option>Tất cả</option>
                            <option>Tiền thuê</option>
                            <option>Tiền điện</option>
                            <option>Tiền nước</option>
                        </Form.Select>
                        <Button variant="outline-primary" size="sm">
                            Lọc
                        </Button>
                    </div>
                </div>

                <Table responsive hover className="align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Mã GD</th>
                            <th>Ngày</th>
                            <th>Loại giao dịch</th>
                            <th>Số tiền (VND)</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id}>
                                <td>#{tx.id.toString().padStart(6, '0')}</td>
                                <td>{tx.date}</td>
                                <td>{tx.type}</td>
                                <td className="fw-bold">{tx.amount}</td>
                                <td>
                                    <Badge bg="success" pill>{tx.status}</Badge>
                                </td>
                                <td>
                                    <Button variant="link" size="sm" className="p-0 text-decoration-none">
                                        Chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="text-center mt-4">
                    <Button variant="outline-primary" className="px-4">
                        Xem thêm
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

// Contracts Section Component
const ContractsSection = () => {
    const contracts = [
        {
            id: "CT0001",
            title: "Hợp đồng thuê căn hộ A102",
            startDate: "15/12/2024",
            endDate: "15/12/2025",
            status: "Đang hiệu lực",
            price: "9,500,000"
        }
    ];

    return (
        <>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Hợp đồng căn hộ</h4>
                        <Button variant="outline-primary">
                            <FileText className="me-1" />
                            Tất cả hợp đồng
                        </Button>
                    </div>

                    {contracts.map(contract => (
                        <Card key={contract.id} className="mb-3 border">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                                <div>
                                    <h5 className="mb-0">{contract.title}</h5>
                                    <span className="text-muted small">Mã hợp đồng: {contract.id}</span>
                                </div>
                                <Badge
                                    bg={contract.status === "Đang hiệu lực" ? "success" : "secondary"}
                                    pill
                                >
                                    {contract.status}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <Calendar size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-muted small">Thời hạn hợp đồng</div>
                                                <div className="fw-medium">{contract.startDate} - {contract.endDate}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <CreditCard size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-muted small">Giá thuê hàng tháng</div>
                                                <div className="fw-medium">{contract.price} VND</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col xs={12}>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="progress w-75 me-3" style={{ height: "8px" }}>
                                                <div className="progress-bar w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <span className="text-muted small">3 tháng / 12 tháng</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="bg-white border-top d-flex justify-content-between py-3">
                                <Button variant="outline-secondary" size="sm">
                                    Chi tiết hợp đồng
                                </Button>
                                <Button variant="primary" size="sm">
                                    Tải xuống hợp đồng
                                </Button>
                            </Card.Footer>
                        </Card>
                    ))}
                </Card.Body>
            </Card>

            <Card className="bg-light border">
                <Card.Body className="text-center py-4">
                    <HouseDoor size={36} className="text-muted mb-3" />
                    <h5>Đăng ký thuê căn hộ mới</h5>
                    <p className="text-muted">Khám phá danh sách các căn hộ có sẵn và đăng ký thuê</p>
                    <Button variant="primary" className="px-4 mt-2">
                        Xem danh sách căn hộ
                    </Button>
                </Card.Body>
            </Card>
        </>
    );
};

export default UserProfilePage;