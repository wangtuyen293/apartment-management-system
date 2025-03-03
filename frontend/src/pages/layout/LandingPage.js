import React, { useEffect } from 'react';
import { Navbar, Nav, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import loginImage from "../../assets/fpt-login.jpg";
import apartmentImage1 from "../../assets/fpt-login.jpg";
import { getApartment, getApartmentDetail } from '../../redux/apartmentSlice';

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();  // Hook để navigate
    const { apartment, loading, error } = useSelector(state => state.apartment);

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const handleViewDetails = (apartmentId) => {

        dispatch(getApartmentDetail(apartmentId));
        navigate(`/apartment/${apartmentId}`);
    };

    return (
        <div>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="#" className="font-weight-bold text-uppercase">FPT Plaza</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button variant="outline-light" className="mr-2" as={Link} to="/login">
                            Đăng Nhập
                        </Button>
                        <Button variant="outline-light" as={Link} to="/register">
                            Đăng Ký
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            {/* Slideshow with Dark Overlay */}
            <Carousel fade>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={loginImage}
                        alt="First slide"
                        style={{ height: '100vh', objectFit: 'cover' }}
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-shadow">Welcome to FPT Plaza</h3>
                        <p className="text-shadow">Find your dream apartment today</p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={loginImage}
                        alt="Second slide"
                        style={{ height: '100vh', objectFit: 'cover' }}
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-shadow">Luxury Living Awaits</h3>
                        <p className="text-shadow">Explore our premium apartments</p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={loginImage}
                        alt="Third slide"
                        style={{ height: '100vh', objectFit: 'cover' }}
                    />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="text-shadow">Perfect Place, Perfect Life</h3>
                        <p className="text-shadow">The best living experience in the heart of the city</p>
                    </div>
                </Carousel.Item>
            </Carousel>

            {/* Apartment Listings Section */}
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
        </div>
    );
};

export default LandingPage;
