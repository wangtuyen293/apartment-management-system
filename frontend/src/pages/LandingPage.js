import React, { useEffect } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apartmentImage1 from "../assets/images/fpt-login.jpg";
import { getApartment, getApartmentDetail } from "../redux/apartmentSlice";
import Banner from "../components/Banner";

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
                        apartment &&
                        apartment.map((apt) => (
                            <Col md={4} key={apt._id} className="mb-4">
                                <div className="card shadow-lg border-0 rounded">
                                    <img
                                        src={apartmentImage1}
                                        className="card-img-top"
                                        alt="Apartment"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{`Căn hộ ${apt.apartmentNumber}`}</h5>
                                        <p className="card-text">
                                            <strong>Tầng:</strong> {apt.floor}
                                            <br />
                                            <strong>Diện tích:</strong>{" "}
                                            {apt.area} m²
                                            <br />
                                            <strong>Giá cho thuê:</strong>{" "}
                                            {apt.price} VND
                                            <br />
                                            <strong>Tình trạng:</strong>{" "}
                                            {apt.status}
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleViewDetails(apt._id)
                                            }
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
        </>
    );
};

export default LandingPage;
