import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Card, Button, Image, NavDropdown, Spinner, Table } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, HouseDoor } from "react-bootstrap-icons";
import loginImage from "../../assets/fpt-login.jpg";
import { jwtDecode } from "jwt-decode";
import { getCustomerRequestRentApartment, ApproveRentApartment, RejectRentApartment } from '../../redux/residentSlice';
import { useDispatch, useSelector } from 'react-redux';

const CustomerRequestRent = () => {
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resident, loading, error } = useSelector(state => state.resident);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setRole(decoded.user.role);
                setUserName(decoded.user.username);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    useEffect(() => {
        dispatch(getCustomerRequestRentApartment());
    }, [dispatch]);


    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setUserName(null);
        setRole(null);
        navigate("/");
    }, [navigate]);

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handleApprove = (requestId) => {
        console.log(requestId)
        dispatch(ApproveRentApartment(requestId));
        window.location.reload();
    };

    const handleReject = (requestId) => {
        dispatch(RejectRentApartment(requestId));
        window.location.reload();
    };

    return (
        <Container fluid style={{ backgroundColor: "#F7F8F3" }}>
            <Row>
                <Col xs={2} className="p-0 position-fixed" style={{ background: "linear-gradient(180deg, #FF4F70, #FF1A55)", height: "100vh", top: 0, left: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #ddd" }}>
                    <Nav className="flex-column">
                        {role === "Admin" ? (
                            <>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <House className="me-2 fs-5" /> Bảng tin
                                </Nav.Link>
                                <Nav.Link href="/apartment-manage" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Tòa nhà
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Phí dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Ghi chỉ số
                                </Nav.Link>
                                <NavDropdown title={<span className="d-flex align-items-center text-white fs-5"><HandThumbsUp className="me-2" /> Khách hàng</span>} id="customer-nav-dropdown" className="text-white">
                                    <NavDropdown.Item href="/customer/view" >Khách hẹn xem</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã cọc</NavDropdown.Item>
                                    <NavDropdown.Item href="/customer/rent">Khách yêu cầu thuê</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Hợp đồng</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/home" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <House className="me-2 fs-5" /> Trang chủ
                                </Nav.Link>
                                <Nav.Link href="/find" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <HouseDoor className="me-2 fs-5" /> Tìm kiếm căn hộ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Thanh toán
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Điều khoản
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    {/* Sidebar Footer */}
                    <div className="text-center mt-auto p-3 text-white">
                        <Image src={loginImage} roundedCircle width="80" height="80" />
                        <p className="mt-2" onClick={handleProfileRedirect} style={{ cursor: "pointer", fontWeight: "bold" }}>
                            {userName ? userName : "Người dùng"}
                        </p>
                        <Button variant="primary" className="d-flex align-items-center mx-auto" onClick={handleLogout} style={{ borderRadius: "30px", padding: "0.5rem 1.5rem" }}>
                            <BoxArrowRight className="me-2" /> Đăng xuất
                        </Button>
                    </div>
                </Col>

                {/* Content */}
                <Col xs={10} className="p-5 ms-auto" style={{ marginLeft: "16.67%" }}>
                    <Container>
                        <h1 className="my-4 text-center text-primary font-weight-bold" style={{ fontSize: "2rem" }}>Danh sách khách yêu cầu thuê phòng</h1>

                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                                <div>
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger text-center" role="alert" style={{ borderRadius: "10px" }}>
                                <strong>Lỗi!</strong> {error}
                            </div>
                        ) : (
                            <div className="shadow-lg rounded p-4" style={{ backgroundColor: "#f9f9f9" }}>
                                <Table striped bordered hover responsive>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Tên khách hàng</th>
                                            <th>Số điện thoại</th>
                                            <th>Số phòng</th>
                                            <th>Loại yêu cầu</th>
                                            <th>Ngày dự kiến vào</th>
                                            <th>Thời hạn HĐ</th>
                                            <th>Xử lí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resident && resident.length > 0 ? (
                                            resident.map((request) => (
                                                <tr key={request._id} style={{ backgroundColor: "#ffffff" }}>
                                                    <td>{request.username}</td>
                                                    <td>{request.phoneNumber}</td>
                                                    <td>{request.apartment}</td>
                                                    <td>{request.status}</td>
                                                    <td>{new Date(request.date).toLocaleDateString()}</td>
                                                    <td>{request.contractMonths} tháng</td>
                                                    <td>
                                                        <Button
                                                            variant="success"
                                                            className="me-2"
                                                            onClick={() => handleApprove(request._id)} // Replace with your approval handler
                                                        >
                                                            Phê duyệt
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleReject(request._id)} // Replace with your rejection handler
                                                        >
                                                            Từ chối
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center" style={{ fontStyle: "italic", color: "#888" }}>Danh sách trống.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Container>
                </Col>

            </Row>
        </Container>
    );
};

export default CustomerRequestRent;
