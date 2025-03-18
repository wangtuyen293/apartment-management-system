import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Spinner, Row, Col, Card, Button, Form,
    InputGroup, Badge, Dropdown, DropdownButton
} from "react-bootstrap";
import {
    Search, Filter, House, CurrencyDollar, SquareFill, SortDown
} from "react-bootstrap-icons";
import apartmentImage1 from '../../assets/images/fpt-login.jpg';
import { getApartment, getApartmentDetail } from '../../redux/apartmentSlice';
import { logoutUser } from "../../redux/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from "../../components/SideBar";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { apartment, loading, error } = useSelector(state => state.apartment);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [priceFilter, setPriceFilter] = useState(null);
    const [areaFilter, setAreaFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [sortOption, setSortOption] = useState(null);

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    useEffect(() => {
        if (apartment) {
            let results = [...apartment];

            if (searchTerm) {
                results = results.filter(apt =>
                    apt.apartmentNumber.toString().includes(searchTerm) ||
                    apt.floor.toString().includes(searchTerm)
                );
            }

            if (priceFilter) {
                switch (priceFilter) {
                    case 'low':
                        results = results.filter(apt => apt.price < 3000);
                        break;
                    case 'medium':
                        results = results.filter(apt => apt.price >= 3000 && apt.price <= 4000);
                        break;
                    case 'high':
                        results = results.filter(apt => apt.price > 4000);
                        break;
                    default:
                        break;
                }
            }

            if (areaFilter) {
                switch (areaFilter) {
                    case 'small':
                        results = results.filter(apt => apt.area < 50);
                        break;
                    case 'medium':
                        results = results.filter(apt => apt.area >= 50 && apt.area <= 80);
                        break;
                    case 'large':
                        results = results.filter(apt => apt.area > 80);
                        break;
                    default:
                        break;
                }
            }

            if (statusFilter) {
                results = results.filter(apt => apt.status === statusFilter);
            }

            if (sortOption) {
                switch (sortOption) {
                    case 'price_asc':
                        results.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        results.sort((a, b) => b.price - a.price);
                        break;
                    case 'area_asc':
                        results.sort((a, b) => a.area - b.area);
                        break;
                    case 'area_desc':
                        results.sort((a, b) => b.area - a.area);
                        break;
                    default:
                        break;
                }
            }

            setFilteredApartments(results);
        }
    }, [apartment, searchTerm, priceFilter, areaFilter, statusFilter, sortOption]);

    const handleViewDetails = (apartmentId) => {
        dispatch(getApartmentDetail(apartmentId));
        navigate(`/apartment/${apartmentId}`);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setPriceFilter(null);
        setAreaFilter(null);
        setStatusFilter(null);
        setSortOption(null);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Container fluid className="p-0" style={{ backgroundColor: "#F5F7FA" }}>
            <Row className="g-0">
                <Sidebar />

                <Col xs={10} className="p-0 ms-auto" style={{ marginLeft: "16.67%" }}>

                    <div className="bg-success text-white py-4 px-4">
                        <Container>
                            <h1 className="display-5 fw-bold">Tìm kiếm căn hộ lý tưởng cho bạn</h1>
                            <p className="fs-5">Khám phá các căn hộ của chúng tôi</p>
                        </Container>
                    </div>

                    <Container fluid className="py-4 bg-white shadow-sm sticky-top">
                        <Row className="align-items-center">
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white">
                                        <Search />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Tìm kiếm số căn hộ hoặc số tầng..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={7}>
                                <Row className="g-2">
                                    <Col>
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title={<><CurrencyDollar /> Giá cả</>}
                                            size="sm"
                                        >
                                            <Dropdown.Item onClick={() => setPriceFilter('low')}>
                                                Dưới 3000 VND
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setPriceFilter('medium')}>
                                                3000 - 4000 VND
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setPriceFilter('high')}>
                                                Trên 4000 VND
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setPriceFilter(null)}>
                                                Xóa bộ lọc
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title={<><SquareFill /> Diện tích</>}
                                            size="sm"
                                        >
                                            <Dropdown.Item onClick={() => setAreaFilter('small')}>
                                                Dưới 50 m²
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setAreaFilter('medium')}>
                                                50 - 80 m²
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setAreaFilter('large')}>
                                                Trên 80 m²
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setAreaFilter(null)}>
                                                Xóa bộ lọc
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title={<><House /> Tình trạng</>}
                                            size="sm"
                                        >
                                            <Dropdown.Item onClick={() => setStatusFilter('Trống')}>
                                                Trống
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setStatusFilter('Đã cho thuê')}>
                                                Đã cho thuê
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setStatusFilter('Đã cọc')}>
                                                Đã cọc
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setStatusFilter('Khách hẹn xem')}>
                                                Khách hẹn xem
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setStatusFilter(null)}>
                                                Xóa bộ lọc
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <DropdownButton
                                            variant="outline-secondary"
                                            title={<><SortDown /> Sắp xếp</>}
                                            size="sm"
                                        >
                                            <Dropdown.Item onClick={() => setSortOption('price_asc')}>
                                                Giá: từ thấp lên cao
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setSortOption('price_desc')}>
                                                Giá: từ cao xuống thấp
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setSortOption('area_asc')}>
                                                Diện tích: từ nhỏ đến lớn
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setSortOption('area_desc')}>
                                                Diện tích: từ lớn đến nhỏ
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => setSortOption(null)}>
                                                Xóa sắp xếp
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1}>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="w-100"
                                >
                                    Xóa lọc
                                </Button>
                            </Col>
                        </Row>
                    </Container>

                    <Container className="mt-3">
                        <Row>
                            <Col>
                                {(searchTerm || priceFilter || areaFilter || statusFilter || sortOption) && (
                                    <div className="mb-3">
                                        <h6 className="d-inline me-2">Bộ lọc:</h6>
                                        {searchTerm && (
                                            <Badge bg="primary" className="me-2 p-2">
                                                Tìm kiếm: {searchTerm}
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    className="ms-2 p-0 border-0"
                                                    onClick={() => setSearchTerm("")}
                                                >
                                                    &times;
                                                </Button>
                                            </Badge>
                                        )}
                                        {priceFilter && (
                                            <Badge bg="info" className="me-2 p-2">
                                                Giá cả: {priceFilter === 'low' ? 'Under 3k' : priceFilter === 'medium' ? '3k-4k' : 'Above 4k'}
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    className="ms-2 p-0 border-0"
                                                    onClick={() => setPriceFilter(null)}
                                                >
                                                    &times;
                                                </Button>
                                            </Badge>
                                        )}
                                        {areaFilter && (
                                            <Badge bg="success" className="me-2 p-2">
                                                Diện tích: {areaFilter === 'small' ? 'Under 50m²' : areaFilter === 'medium' ? '50-80m²' : 'Above 80m²'}
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="ms-2 p-0 border-0"
                                                    onClick={() => setAreaFilter(null)}
                                                >
                                                    &times;
                                                </Button>
                                            </Badge>
                                        )}
                                        {statusFilter && (
                                            <Badge bg="warning" className="me-2 p-2 text-dark">
                                                Tình trạng: {statusFilter}
                                                <Button
                                                    size="sm"
                                                    variant="warning"
                                                    className="ms-2 p-0 border-0"
                                                    onClick={() => setStatusFilter(null)}
                                                >
                                                    &times;
                                                </Button>
                                            </Badge>
                                        )}
                                        {sortOption && (
                                            <Badge bg="secondary" className="me-2 p-2">
                                                Sắp xếp: {
                                                    sortOption === 'price_asc' ? 'Price ↑' :
                                                        sortOption === 'price_desc' ? 'Price ↓' :
                                                            sortOption === 'area_asc' ? 'Area ↑' : 'Area ↓'
                                                }
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="ms-2 p-0 border-0"
                                                    onClick={() => setSortOption(null)}
                                                >
                                                    &times;
                                                </Button>
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Container>

                    <Container className="my-4">
                        <h3 className="mb-4">Căn hộ có sẵn</h3>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Loading apartments...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger">
                                <p className="mb-0">Error: {error}</p>
                            </div>
                        ) : filteredApartments.length === 0 ? (
                            <div className="alert alert-info">
                                <p className="mb-0">Không có căn hộ nào khớp với bộ lọc, thử 1 bộ lọc khác.</p>
                            </div>
                        ) : (
                            <Row>
                                {filteredApartments.map((apt) => (
                                    <Col lg={4} md={6} key={apt._id} className="mb-4">
                                        <Card className="h-100 shadow-sm border-0 rounded-3 apartment-card">
                                            <div className="position-relative">
                                                <Card.Img
                                                    variant="top"
                                                    src={apartmentImage1}
                                                    className="img-fluid"
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                />
                                                <Badge
                                                    bg={apt.status === 'Trống' ? 'success' : apt.status === 'Đã cho thuê' ? 'danger' : apt.status === 'Đang xét duyệt' ? 'primary' : apt.status === 'Đã cọc' ? 'secondary' : 'warning'}
                                                    className="position-absolute top-0 end-0 m-2 py-2 px-3"
                                                >
                                                    {apt.status}
                                                </Badge>
                                            </div>
                                            <Card.Body>
                                                <Card.Title className="fs-4 d-flex justify-content-between align-items-center">
                                                    <span>Căn hộ {apt.apartmentNumber}</span>
                                                    <Badge bg="primary" pill>{apt.area} m²</Badge>
                                                </Card.Title>
                                                <Card.Text>
                                                    <Row className="mt-3">
                                                        <Col xs={6}>
                                                            <div className="text-muted mb-2">
                                                                <i className="bi bi-building me-2"></i> Tầng {apt.apartmentNumber / 100}
                                                            </div>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <div className="text-muted mb-2">
                                                                <i className="bi bi-square me-2"></i> Diện tích:  {apt.area} m²
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <h5 className="text-primary mb-0">{formatPrice(apt.price)} VND</h5>
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() => handleViewDetails(apt._id)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>

                    {/* Footer info */}
                    <div className="bg-light py-4 mt-4">
                        <Container>
                            <p className="text-center text-muted mb-0">
                                ApaMan
                            </p>
                        </Container>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;