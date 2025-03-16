import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApartment } from "../../redux/apartmentSlice";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Table, Alert } from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import { FaEdit, FaTrash, FaBuilding } from "react-icons/fa";

const MyApartmentPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy user từ Redux store
    const { user } = useSelector(state => state.auth);
    const { apartments, loading, error } = useSelector(state => state.apartment);

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        console.log("Fetching apartments...");
        dispatch(getApartment())
            .then(response => console.log("API Response:", response))
            .catch(error => console.error("API Error:", error));
    }, [dispatch]);

    // Lọc danh sách căn hộ của user hiện tại
    const userApartments = apartments?.filter(apartment =>
        String(apartment.ownerId) === String(user?.id)
    ) || [];
    console.log(user.id); // có dữ liệu 67d30250d142a6ebeaa1ca47
    console.log("User ID:", user?.id, typeof user?.id);
    console.log("Apartments:", apartments);

    // Xử lý xóa căn hộ
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa căn hộ này?")) {
            // dispatch(deleteApartment(id));
        }
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar user={user} />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow">
                        <h1 className="h3 mb-0">
                            <FaBuilding className="me-2" /> Danh sách Căn hộ của tôi
                        </h1>
                        <p className="mb-0 opacity-75">Quản lý các căn hộ bạn sở hữu</p>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 pt-4 pb-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <FaBuilding className="me-2 text-primary" /> Căn hộ của bạn
                                </h5>
                                <Button variant="primary" size="sm" onClick={() => navigate("/add-apartment")}>
                                    + Thêm căn hộ
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <Alert variant="danger">
                                        <strong>Lỗi!</strong> {error}
                                    </Alert>
                                ) : userApartments.length > 0 ? (
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0">Tên căn hộ</th>
                                                <th className="border-0">Số phòng</th>
                                                <th className="border-0">Diện tích (m²)</th>
                                                <th className="border-0">Giá thuê (VND)</th>
                                                <th className="border-0">Trạng thái</th>
                                                <th className="border-0 text-end">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userApartments.map(apartment => (
                                                <tr key={apartment._id}>
                                                    <td>{apartment.name || "Không có tên"}</td>
                                                    <td>{apartment.apartmentNumber}</td>
                                                    <td>{apartment.area} m²</td>
                                                    <td>{apartment.price.toLocaleString()} VND</td>
                                                    <td>{apartment.status}</td>
                                                    <td className="text-end">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => navigate(`/edit-apartment/${apartment._id}`)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(apartment._id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        Bạn chưa có căn hộ nào.
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default MyApartmentPage;
