import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllServiceCategories,
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
} from "../../redux/serviceSlice";
import { logoutUser } from "../../redux/authSlice";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Table,
    Form,
    Modal,
    Alert,
} from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import { FaList, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ServiceManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const serviceState = useSelector(state => state.service || {});
    console.log("Redux State:", serviceState);
    const { serviceCategories = [], loading, error } = serviceState;

    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [priceQuotation, setPriceQuotation] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        dispatch(getAllServiceCategories());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handleShowModal = (category = null) => {
        setEditingCategory(category);
        setCategoryName(category ? category.name : "");
        setDescription(category ? category.description : "");
        setPriceQuotation(category ? String(category.price_quotation) : ""); 
        setShowModal(true);
    };

    const handleSaveCategory = async () => {
        if (categoryName.trim() === "") {
            alert("Tên dịch vụ và báo giá không được để trống!");
            return;
        }

        if (isNaN(priceQuotation) || Number(priceQuotation) <= 0) {
            alert("Báo giá phải là một số hợp lệ!");
            return;
        }

        const categoryData = {
            name: categoryName,
            description,
            price_quotation: Number(priceQuotation),
        };

        console.log("Dữ liệu gửi lên Redux:", categoryData);

        if (editingCategory) {
            await dispatch(updateServiceCategory({ id: editingCategory._id, data: categoryData }));
        } else {
            await dispatch(createServiceCategory(categoryData));
        }

        setShowModal(false);

        // Fetch lại danh sách dịch vụ để cập nhật UI
        dispatch(getAllServiceCategories());
    };


    const handleDeleteCategory = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
            dispatch(deleteServiceCategory(id));
        }
    };

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                <Col md={2} className="d-none d-md-block">
                    <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />
                </Col>

                <Col xs={12} md={10} className="ms-auto p-0">
                    <div className="bg-primary text-white py-4 px-4 shadow">
                        <h1 className="h3 mb-0">
                            <FaList className="me-2" /> Quản lý Dịch vụ
                        </h1>
                    </div>

                    <Container className="py-4">
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white border-0 pt-4 pb-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <FaList className="me-2 text-primary" /> Dịch vụ
                                </h5>
                                <Button variant="primary" size="sm" onClick={() => handleShowModal()}>
                                    <FaPlus className="me-1" /> Thêm Mới
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {loading && serviceCategories.length === 0 ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                                    </div>
                                ) : error ? (
                                    <Alert variant="danger">
                                        <strong>Lỗi!</strong> {error}
                                    </Alert>
                                ) : (
                                    <Table hover className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0">Tên dịch vụ</th>
                                                <th className="border-0">Mô tả</th>
                                                <th className="border-0">Đơn giá (VND)</th>
                                                <th className="border-0 text-end">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceCategories.length > 0 ? (
                                                serviceCategories.map((category) => (
                                                    <tr key={category._id}>
                                                        <td>{category.name}</td>
                                                        <td>{category.description || "Không có mô tả"}</td>
                                                        <td>{category.price_quotation.toLocaleString()} VND</td>
                                                        <td className="text-end">
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleShowModal(category)}
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteCategory(category._id)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5 text-muted">
                                                        Chưa có dịch vụ nào.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>
                </Col>
            </Row>

            {/* Modal Thêm/Sửa dịch vụ */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên dịch vụ</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Báo giá (VND)</Form.Label>
                            <Form.Control
                                type="number"
                                value={priceQuotation}
                                onChange={(e) => setPriceQuotation(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveCategory}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ServiceManagementPage;
