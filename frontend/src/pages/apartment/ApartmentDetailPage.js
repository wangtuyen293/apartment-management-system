import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApartmentDetail, requestForViewApartment, requestForRentApartment } from '../../redux/apartmentSlice';
import { Spinner, Button, Container, Row, Col, Card, Carousel, Modal, Form } from 'react-bootstrap';
import apartmentImage1 from '../../assets/fpt-login.jpg';
import { jwtDecode } from "jwt-decode";

const ApartmentDetailPage = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRentModal, setShowRentModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [contractMonths, setContractMonths] = useState('6');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { apartmentDetail, loading, error, viewRequestStatus, rentRequestStatus } = useSelector(state => state.apartment);
    const isAuthenticated = localStorage.getItem("accessToken");

    useEffect(() => {
        dispatch(getApartmentDetail(id));
    }, [id, dispatch]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.user._id);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);


    const handleAction = (action) => {
        if (!isAuthenticated) {
            alert('You need to log in to perform this action!');
            navigate('/login');
            return;
        }
        else if (action === 'Hẹn xem căn hộ') {
            setShowModal(true);
        } else if (action === 'Yêu cầu thuê phòng') {
            setShowRentModal(true);
        }
    };

    const handleSubmitDate = () => {
        if (selectedDate) {
            dispatch(requestForViewApartment({ apartmentId: id, userId: userId, date: selectedDate }));
            setShowModal(false);
            alert('Yêu cầu xem căn hộ đã được gửi thành công!'); // Thông báo thành công
            window.location.reload(); // Reload the page after submission
        } else {
            alert('Please select a date!');
        }
    };

    const handleSubmitRentRequest = () => {
        if (selectedDate && contractMonths) {

            dispatch(requestForRentApartment({ apartmentId: id, userId: userId, date: selectedDate, contractMonths }));
            setShowRentModal(false);
            alert('Yêu cầu thuê phòng đã được gửi thành công!'); // Thông báo thành công
            window.location.reload(); // Reload the page after submission
        } else {
            alert('Please provide both a start date and contract duration!');
        }
    };



    const isViewDisabled =
        apartmentDetail && (apartmentDetail.status === "Đang xét duyệt" || apartmentDetail.status === "Đã cọc");

    return (
        <div>
            <Container className="my-5">
                <Link
                    to={isAuthenticated ? "/find" : "/"}
                    className="btn btn-outline-secondary mb-3"
                >
                    ← Trở về
                </Link>

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
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src={apartmentImage1}
                                                alt={`Apartment ${apartmentDetail.apartment_number}`}
                                                style={{ objectFit: 'cover', height: '400px' }}
                                            />
                                        </Carousel.Item>
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
                                                Mô tả: Tự cảm nhận
                                            </strong>
                                            <br />
                                            {/* Mô tả chi tiết */}
                                            {apartmentDetail.description}
                                        </Card.Text>

                                        <Button
                                            variant="danger"
                                            size="lg"
                                            block
                                            className="mb-4 rounded-pill shadow-sm"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => handleAction('Hẹn xem căn hộ')}
                                            disabled={isViewDisabled}
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
                                            disabled={isViewDisabled}
                                        >
                                            Yêu cầu thuê phòng
                                        </Button>

                                        <Button
                                            variant="success"
                                            size="lg"
                                            block
                                            className="mb-4 rounded-pill shadow-sm"
                                            onClick={() => handleAction('Đặt cọc ngay')}
                                            disabled={isViewDisabled}
                                        >
                                            Đặt cọc ngay
                                        </Button>
                                        {isViewDisabled && <p className="text-danger">Căn hộ đang deal.</p>}
                                        {/* Show request status */}
                                        {viewRequestStatus && <div className="text-success">{viewRequestStatus}</div>}
                                        {rentRequestStatus && <div className="text-success">{rentRequestStatus}</div>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )
                )}
            </Container>

            {/* Modal for view date */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn ngày xem căn hộ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="viewDate">
                            <Form.Label>Chọn ngày:</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                isInvalid={selectedDate && new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn ngày hợp lệ (không chọn ngày trong quá khứ).
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitDate}
                        disabled={!selectedDate || new Date(selectedDate) < new Date()}
                    >
                        Gửi yêu cầu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for rent request */}
            <Modal show={showRentModal} onHide={() => setShowRentModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn ngày và thời gian hợp đồng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="rentDate">
                            <Form.Label>Chọn ngày bắt đầu:</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                isInvalid={selectedDate && new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn ngày hợp lệ (không chọn ngày trong quá khứ).
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="contractDuration">
                            <Form.Label>Thời gian hợp đồng:</Form.Label>
                            <Form.Control
                                as="select"
                                value={contractMonths}
                                onChange={(e) => setContractMonths(e.target.value)}
                            >
                                <option value="6">6 tháng</option>
                                <option value="12">1 năm</option>
                                <option value="24">2 năm</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRentModal(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmitRentRequest}
                        disabled={!selectedDate || new Date(selectedDate) < new Date()}
                    >
                        Gửi yêu cầu
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ApartmentDetailPage;
