import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApartmentDetail, requestForViewApartment, requestForRentApartment } from '../../redux/apartmentSlice';
import {
    Spinner, Button, Container, Row, Col, Card, Carousel, Modal, Form,
    Badge, ListGroup, Tabs, Tab, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { FaMapMarkerAlt, FaRulerCombined, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle, FaHome, FaArrowLeft, FaEye, FaHandshake, FaMoneyCheck } from 'react-icons/fa';
import apartmentImage1 from '../../assets/images/fpt-login.jpg';
import { jwtDecode } from "jwt-decode";
import Sidebar from '../../components/SideBar';
import { logoutUser } from "../../redux/authSlice";

const ApartmentDetailPage = () => {
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [showRentModal, setShowRentModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [contractMonths, setContractMonths] = useState('6');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { apartmentDetail, loading, error, viewRequestStatus, rentRequestStatus } = useSelector(state => state.apartment);
    const { user } = useSelector((state) => state.auth);
    const isAuthenticated = user;

    useEffect(() => {
        dispatch(getApartmentDetail(id));
    }, [id, dispatch]);

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
            dispatch(requestForViewApartment({ apartmentId: id, userId: user.id, date: selectedDate }));
            setShowModal(false);
            alert('Yêu cầu xem căn hộ đã được gửi thành công!');
            window.location.reload();
        } else {
            alert('Please select a date!');
        }
    };

    const handleSubmitRentRequest = () => {
        if (selectedDate && contractMonths) {
            dispatch(requestForRentApartment({ apartmentId: id, userId: user.id, date: selectedDate, contractMonths }));
            setShowRentModal(false);
            alert('Yêu cầu thuê phòng đã được gửi thành công!');
            window.location.reload();
        } else {
            alert('Please provide both a start date and contract duration!');
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const isViewDisabled =
        apartmentDetail && (apartmentDetail.status === "Đang xét duyệt" || apartmentDetail.status === "Đã cọc");

    // Format price with commas
    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Đã cọc': return 'warning';
            case 'Đang xét duyệt': return 'info';
            case 'Đã thuê': return 'danger';
            default: return 'success';
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <Container fluid className="py-4">
                <Row>
                    <Col md={2} className="d-none d-md-block">
                        <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />
                    </Col>

                    <Col xs={12} md={10} className="px-md-4">
                        <Link
                            to={isAuthenticated ? "/find" : "/"}
                            className="btn btn-outline-secondary mb-4 d-flex align-items-center"
                        >
                            <FaArrowLeft className="me-2" /> Trở về
                        </Link>

                        {loading ? (
                            <div className="text-center p-5">
                                <Spinner animation="border" variant="primary" className="mb-3" />
                                <p className="text-muted">Đang tải thông tin căn hộ...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center p-5 bg-white rounded shadow">
                                <div className="text-danger mb-3">
                                    <FaInfoCircle size={40} />
                                </div>
                                <h4>Đã xảy ra lỗi</h4>
                                <p className="text-muted">{error}</p>
                            </div>
                        ) : apartmentDetail && (
                            <>
                                <div className="bg-white rounded shadow-sm mb-4 p-3">
                                    <h2 className="border-bottom pb-3 d-flex align-items-center">
                                        <FaHome className="me-2 text-primary" />
                                        Căn hộ {apartmentDetail.apartment_number}
                                        <Badge
                                            bg={getStatusVariant(apartmentDetail.status)}
                                            className="ms-3 fs-6"
                                        >
                                            {apartmentDetail.status}
                                        </Badge>
                                    </h2>
                                </div>

                                <Row>
                                    <Col lg={7} className="mb-4">
                                        <Card className="shadow-sm border-0 overflow-hidden">
                                            <Carousel interval={3000} className="apartment-carousel">
                                                <Carousel.Item>
                                                    <div className="position-relative">
                                                        <img
                                                            className="d-block w-100"
                                                            src={apartmentImage1}
                                                            alt={`Apartment ${apartmentDetail.apartment_number}`}
                                                            style={{ objectFit: 'cover', height: '500px' }}
                                                        />
                                                        <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark p-3 text-white">
                                                            <h5 className="mb-0">Phòng khách</h5>
                                                        </div>
                                                    </div>
                                                </Carousel.Item>
                                                <Carousel.Item>
                                                    <div className="position-relative">
                                                        <img
                                                            className="d-block w-100"
                                                            src={apartmentImage1}
                                                            alt={`Apartment ${apartmentDetail.apartment_number}`}
                                                            style={{ objectFit: 'cover', height: '500px' }}
                                                        />
                                                        <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-dark p-3 text-white">
                                                            <h5 className="mb-0">Phòng ngủ</h5>
                                                        </div>
                                                    </div>
                                                </Carousel.Item>
                                            </Carousel>
                                        </Card>
                                    </Col>

                                    <Col lg={5}>
                                        <Card className="shadow-sm border-0 mb-4">
                                            <Card.Header className="bg-primary text-white py-3">
                                                <h4 className="mb-0">Thông tin căn hộ</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item className="py-3 d-flex align-items-center">
                                                        <div className="text-primary me-3">
                                                            <FaMapMarkerAlt size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-muted small">Tầng</div>
                                                            <div className="fw-bold">{apartmentDetail.floor}</div>
                                                        </div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="py-3 d-flex align-items-center">
                                                        <div className="text-primary me-3">
                                                            <FaRulerCombined size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-muted small">Diện tích</div>
                                                            <div className="fw-bold">{apartmentDetail.area} m²</div>
                                                        </div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="py-3 d-flex align-items-center">
                                                        <div className="text-primary me-3">
                                                            <FaMoneyBillWave size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-muted small">Giá cho thuê</div>
                                                            <div className="fw-bold text-danger">{formatPrice(apartmentDetail.price)} VND</div>
                                                        </div>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>

                                        <Card className="shadow-sm border-0 mb-4">
                                            <Card.Body>
                                                <div className={`alert ${isViewDisabled ? 'alert-warning' : 'alert-info'} d-flex align-items-center mb-4`}>
                                                    <FaInfoCircle className="me-2" />
                                                    <div>
                                                        {isViewDisabled
                                                            ? 'Căn hộ này hiện đang trong quá trình xét duyệt hoặc đã có người đặt cọc.'
                                                            : 'Căn hộ này hiện có sẵn để thuê. Đặt lịch xem ngay!'}
                                                    </div>
                                                </div>

                                                <div className="d-grid gap-3">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="lg"
                                                        className="d-flex align-items-center justify-content-center"
                                                        onClick={() => handleAction('Hẹn xem căn hộ')}
                                                        disabled={isViewDisabled}
                                                    >
                                                        <FaEye className="me-2" /> Hẹn xem căn hộ
                                                    </Button>

                                                    <Button
                                                        variant="outline-primary"
                                                        size="lg"
                                                        className="d-flex align-items-center justify-content-center"
                                                        onClick={() => handleAction('Yêu cầu thuê phòng')}
                                                        disabled={isViewDisabled}
                                                    >
                                                        <FaHandshake className="me-2" /> Yêu cầu thuê phòng
                                                    </Button>

                                                    <Button
                                                        variant="success"
                                                        size="lg"
                                                        className="d-flex align-items-center justify-content-center"
                                                        onClick={() => handleAction('Đặt cọc ngay')}
                                                        disabled={isViewDisabled}
                                                    >
                                                        <FaMoneyCheck className="me-2" /> Đặt cọc ngay
                                                    </Button>
                                                </div>

                                                {viewRequestStatus &&
                                                    <div className="alert alert-success mt-3">{viewRequestStatus}</div>}
                                                {rentRequestStatus &&
                                                    <div className="alert alert-success mt-3">{rentRequestStatus}</div>}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col>
                                        <Card className="shadow-sm border-0">
                                            <Card.Body>
                                                <Tabs defaultActiveKey="description" className="mb-3">
                                                    <Tab eventKey="description" title="Mô tả">
                                                        <div className="p-3">
                                                            <h5 className="border-bottom pb-2">Chi tiết căn hộ</h5>
                                                            <p className="text-muted mt-3">
                                                                {apartmentDetail.description || "Tự cảm nhận"}
                                                            </p>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="amenities" title="Tiện ích">
                                                        <div className="p-3">
                                                            <h5 className="border-bottom pb-2">Tiện ích căn hộ</h5>
                                                            <Row className="mt-3">
                                                                <Col md={4} className="mb-3">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                                            <i className="fas fa-wifi"></i>
                                                                        </div>
                                                                        <span>Wifi miễn phí</span>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} className="mb-3">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                                            <i className="fas fa-snowflake"></i>
                                                                        </div>
                                                                        <span>Điều hòa</span>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} className="mb-3">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-light rounded-circle p-2 me-2">
                                                                            <i className="fas fa-tv"></i>
                                                                        </div>
                                                                        <span>TV</span>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Tab>
                                                    <Tab eventKey="policies" title="Chính sách">
                                                        <div className="p-3">
                                                            <h5 className="border-bottom pb-2">Chính sách thuê</h5>
                                                            <ul className="mt-3">
                                                                <li className="mb-2">Đặt cọc: 1 tháng tiền thuê</li>
                                                                <li className="mb-2">Hợp đồng tối thiểu: 6 tháng</li>
                                                                <li className="mb-2">Thanh toán: Hàng tháng</li>
                                                            </ul>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Modal for view date */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-primary" />
                        Chọn ngày xem căn hộ
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="viewDate" className="mb-3">
                            <Form.Label>Chọn ngày:</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                isInvalid={selectedDate && new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)}
                                className="border-primary"
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn ngày hợp lệ (không chọn ngày trong quá khứ).
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Chọn ngày phù hợp để chúng tôi sắp xếp lịch xem căn hộ.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
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
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="d-flex align-items-center">
                        <FaHandshake className="me-2 text-primary" />
                        Yêu cầu thuê căn hộ
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="rentDate" className="mb-3">
                            <Form.Label>Chọn ngày bắt đầu:</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                isInvalid={selectedDate && new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)}
                                className="border-primary"
                            />
                            <Form.Control.Feedback type="invalid">
                                Vui lòng chọn ngày hợp lệ (không chọn ngày trong quá khứ).
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="contractDuration" className="mb-3">
                            <Form.Label>Thời gian hợp đồng:</Form.Label>
                            <Form.Select
                                value={contractMonths}
                                onChange={(e) => setContractMonths(e.target.value)}
                                className="border-primary"
                            >
                                <option value="6">6 tháng</option>
                                <option value="12">1 năm</option>
                                <option value="24">2 năm</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Lựa chọn thời hạn hợp đồng phù hợp với nhu cầu của bạn.
                            </Form.Text>
                        </Form.Group>
                    </Form>

                    <div className="alert alert-info mt-3">
                        <div className="d-flex">
                            <div className="me-2"><FaInfoCircle /></div>
                            <div>
                                <strong>Lưu ý:</strong> Sau khi gửi yêu cầu, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận thông tin.
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowRentModal(false)}>
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

            {/* Add custom CSS for gradient background in carousel */}
            <style jsx="true">{`
                .bg-gradient-dark {
                    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
                }
                .apartment-carousel .carousel-control-prev,
                .apartment-carousel .carousel-control-next {
                    width: 10%;
                    opacity: 0.7;
                }
                .apartment-carousel .carousel-indicators {
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
};

export default ApartmentDetailPage;