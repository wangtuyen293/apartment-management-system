import React, { useEffect } from "react";
import { Button, Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apartmentImage1 from "../assets/images/fpt-login.jpg";
import { getApartment, getApartmentDetail } from "../redux/apartmentSlice";
import Banner from "../components/Banner";
import "../assets/css/ApartmentLandingPage.css"
import { Building, CurrencyExchange, PinAngleFill, Rulers, Search } from "react-bootstrap-icons";

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartment, loading, error } = useSelector(
        (state) => state.apartment
    );

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const handleViewDetails = (apartmentId) => {
        dispatch(getApartmentDetail(apartmentId));
        navigate(`/apartment/${apartmentId}`);
    };

    return (
        <>
            <Banner />

            <Container className="my-5">
                <h2 className="text-start mb-5">Khám phá những căn hộ mới nhất</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading apartments...</p>
                    </div>
                ) : error ? (
                    <div className="text-center my-5">
                        <p className="text-danger">⚠ {error}</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {apartment &&
                            apartment.map((apt) => (
                                <Col md={4} key={apt._id}>
                                    <Card className="shadow-lg border-0 rounded overflow-hidden apartment-card pe-auto shadow-lg mb-5 bg-body-tertiary rounded" onClick={() => handleViewDetails(apt._id)} style={{"cursor": "pointer"}}>
                                        <Card.Img
                                            variant="top"
                                            src={apartmentImage1}
                                            alt="Apartment"
                                            className="apartment-img"
                                        />
                                        <Card.Body>
                                            <Card.Title className="mb-3">{`Căn hộ ${apt.apartmentNumber}`}</Card.Title>
                                            <Card.Text>
                                                <strong><Building className="text-primary"/> Tầng:</strong> {apt.floor} <br />
                                                <strong><Rulers className="text-success"/> Diện tích:</strong> {apt.area} m² <br />
                                                <strong><CurrencyExchange className="text-warning"/> Giá:</strong> {apt.price.toLocaleString()} VND <br />
                                                <strong><PinAngleFill className="text-danger"/> Tình trạng:</strong> {apt.status}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default LandingPage;
