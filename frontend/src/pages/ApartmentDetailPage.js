import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApartmentDetail } from '../redux/apartmentSlice';
import { Spinner, Button, Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import apartmentImage1 from '../assets/fpt-login.jpg'; // You can replace this with multiple image URLs

const ApartmentDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartmentDetail, loading, error } = useSelector(state => state.apartment);
    const { token, user } = useSelector(state => state.auth); // Get token and user from Redux state

    // Check if the user is authenticated based on token (from Redux or localStorage)
    const isAuthenticated = token || localStorage.getItem("token");

    useEffect(() => {
        dispatch(getApartmentDetail(id));
    }, [id, dispatch]);

    const handleAction = (action) => {
        if (!isAuthenticated) {
            alert('You need to log in to perform this action!'); // Show the alert first
            navigate('/login'); // Then navigate to the login page
            return;
        }

        // Handle the action based on the button clicked if user is authenticated
        alert(`${action} functionality not implemented yet!`);
    };


    return (
        <div>
            <Container className="my-5">
                {/* Back Button */}
                <Link to="/" className="btn btn-outline-secondary mb-3">
                    ← Back to Listings
                </Link>

                {/* Apartment Details */}
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading apartment details...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-danger">
                        <p>Error: {error}</p>
                    </div>
                ) : (
                    apartmentDetail && (
                        <Row>
                            <Col md={6} className="mb-4">
                                {/* Image Carousel */}
                                <Card className="shadow-lg border-0 rounded-lg">
                                    <Carousel>
                                        {/* Add multiple images to the Carousel */}
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src={apartmentImage1}
                                                alt={`Apartment ${apartmentDetail.apartment_number}`}
                                                style={{ objectFit: 'cover', height: '400px' }}
                                            />
                                        </Carousel.Item>
                                        {/* Repeat for other images if necessary */}
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src={apartmentImage1} // Replace with actual image URL
                                                alt={`Apartment ${apartmentDetail.apartment_number}`}
                                                style={{ objectFit: 'cover', height: '400px' }}
                                            />
                                        </Carousel.Item>
                                    </Carousel>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="shadow-lg border-0 rounded-lg">
                                    <Card.Body>
                                        <Card.Title className="mb-4" style={{ fontSize: '1.75rem', fontWeight: '600' }}>
                                            {`Căn hộ ${apartmentDetail.apartment_number}`}
                                        </Card.Title>

                                        <Card.Text className="mb-2">
                                            <strong>Tầng:</strong> {apartmentDetail.floor}
                                        </Card.Text>
                                        <Card.Text className="mb-2">
                                            <strong>Diện tích:</strong> {apartmentDetail.area} m²
                                        </Card.Text>
                                        <Card.Text className="mb-2">
                                            <strong>Giá cho thuê:</strong> {apartmentDetail.price} VND
                                        </Card.Text>
                                        <Card.Text className="mb-2">
                                            <strong>Tình trạng:</strong> {apartmentDetail.status}
                                        </Card.Text>
                                        <Card.Text className="mb-4">
                                            <strong>
                                                Mô tả: ƯỚC MƠ VỀ CĂN NHÀ ĐẦU ĐỜI
                                            </strong>
                                            <br />
                                            ✨ Giữa guồng quay hối hả của cuộc sống hiện đại, những người trẻ, luôn nỗ lực để đạt được nhiều mục tiêu, từ sự nghiệp cho đến tài chính. Trong đó, đại đa số chúng ta đều có một khát khao chung chính là sở hữu tổ ấm của riêng mình.
                                            <br />
                                            ✨ FPT_Plaza, căn nhà đầu đời không chỉ sở hữu không gian sống tiện nghi, hệ thống tiện ích xung quanh thời thượng, vị trí trung tâm của nhiều khu đại đô thị, đó phải còn là nơi hưởng thụ chất sống yên bình cùng những người thân yêu.
                                            <br />
                                            ✨ Thấu hiểu tâm tư của mọi người, #FPT ra mắt #Căn_hộ_FPT_Plaza như một món quà tri ân những nỗ lực của người trẻ, giúp họ dễ dàng sở hữu căn nhà đầu đời.
                                            <br />
                                            Dự án được kỳ vọng mang đến cơ hội giúp các bạn trải nghiệm chất sống vui khỏe, tự do tận hưởng vô vàn tiện ích xung quanh.
                                            <br />
                                            <br />
                                            {apartmentDetail.description}
                                        </Card.Text>

                                        <Button
                                            variant="danger"
                                            size="lg"
                                            block
                                            className="mb-4 rounded-pill shadow-sm"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => handleAction('Hẹn xem căn hộ')}
                                        >
                                            Hẹn xem căn hộ
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            block
                                            className="mb-4 rounded-pill shadow-sm"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => handleAction('Yêu cầu thuê phòng')}
                                        >
                                            Yêu cầu thuê phòng
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="lg"
                                            block
                                            className="mb-4 rounded-pill shadow-sm"
                                            onClick={() => handleAction('Đặt cọc ngay')}
                                        >
                                            Đặt cọc ngay
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )
                )}
            </Container>
        </div>
    );
};

export default ApartmentDetailPage;
