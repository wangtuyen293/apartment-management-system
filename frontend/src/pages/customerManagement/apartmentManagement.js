import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Card, Button, Image, NavDropdown, Spinner, Table } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, HouseDoor } from "react-bootstrap-icons";
import loginImage from "../../assets/fpt-login.jpg";
import { jwtDecode } from "jwt-decode";
import { getApartment } from '../../redux/apartmentSlice';
import { useDispatch, useSelector } from 'react-redux';

const ApartmentManagement = () => {
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartment, loading, error } = useSelector(state => state.apartment);

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
        dispatch(getApartment());
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
                                            <th>Số phòng</th>
                                            <th>Tầng</th>
                                            <th>Tình trạng</th>
                                            <th>Người thuê</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apartment && apartment.length > 0 ? (
                                            apartment.map((request) => (
                                                <tr key={request._id} style={{ backgroundColor: "#ffffff" }}>
                                                    <td>{request.apartment_number}</td>
                                                    <td>{request.floor}</td>
                                                    <td>{request.status}</td>
                                                    <td>{request.user_id ? request.user_id.name : 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center" style={{ fontStyle: "italic", color: "#888" }}>
                                                    Danh sách trống.
                                                </td>
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

export default ApartmentManagement;
