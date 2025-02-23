import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner, Row, Col, Nav, Card, Button, Image, NavDropdown } from "react-bootstrap";
import { House, Gear, CreditCard, FileText, BoxArrowRight, HandThumbsUp, Chat, Share, HouseDoor } from "react-bootstrap-icons";
import loginImage from "../assets/fpt-login.jpg";
import { jwtDecode } from "jwt-decode";
import apartmentImage1 from "../assets/fpt-login.jpg";
import { getApartment, getApartmentDetail } from '../redux/apartmentSlice';
import { useDispatch, useSelector } from 'react-redux';

const HomePage = () => {
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartment, loading, error } = useSelector(state => state.apartment);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.username);
                setRole(decoded.role);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const handleViewDetails = (apartmentId) => {

        dispatch(getApartmentDetail(apartmentId));
        navigate(`/apartment/${apartmentId}`);
    };

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
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <Gear className="me-2 fs-5" /> Tòa nhà
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <CreditCard className="me-2 fs-5" /> Phí dịch vụ
                                </Nav.Link>
                                <Nav.Link href="#" className="d-flex align-items-center p-3 text-white hover-effect">
                                    <FileText className="me-2 fs-5" /> Ghi chỉ số
                                </Nav.Link>
                                <NavDropdown title={<span className="d-flex align-items-center text-white fs-5"><HandThumbsUp className="me-2" /> Khách hàng</span>} id="customer-nav-dropdown" className="text-white">
                                    <NavDropdown.Item href="#" >Khách hẹn xem</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã cọc</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Khách đã thuê</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Hợp đồng</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/" className="d-flex align-items-center p-3 text-white hover-effect">
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
                    <Container className="my-5">
                        <Row>
                            {loading ? (
                                <Col className="text-center">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-3">Loading apartments...</p>
                                </Col>
                            ) : error ? (
                                <Col className="text-center">
                                    <p className="text-danger">Error: {error}</p>
                                </Col>
                            ) : (
                                apartment && apartment.map((apt) => (
                                    <Col md={4} key={apt._id} className="mb-4">
                                        <div className="card shadow-lg border-0 rounded">
                                            <img src={apartmentImage1} className="card-img-top" alt="Apartment" />
                                            <div className="card-body">
                                                <h5 className="card-title">{`Căn hộ ${apt.apartment_number}`}</h5>
                                                <p className="card-text">
                                                    <strong>Tầng:</strong> {apt.floor}<br />
                                                    <strong>Diện tích:</strong> {apt.area} m²<br />
                                                    <strong>Giá cho thuê:</strong> {apt.price} VND<br />
                                                    <strong>Tình trạng:</strong> {apt.status}
                                                </p>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleViewDetails(apt._id)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
