import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaUsers, FaBuilding, FaHistory, FaTools } from "react-icons/fa";
import "../../assets/css/AdminDashboard.css";
import { fetchUsers } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        apartments: 50,
        transactions: 200,
        services: 30,
    });

    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <Container className="dashboard-container my-5">
            <h3 className="mb-5 ms-4">Thống Kê Tổng Quan</h3>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row className="mx-3">
                    <Col md={6} className="mb-3">
                        <Card className="dashboard-card shadow rounded">
                            <Card.Body>
                                <h5 className="fw-bolder">Người Dùng</h5>
                                <p className="text-secondary fs-6 p-0">
                                    <FaUsers className="dashboard-icon users" />{" "}
                                    {users.length}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="dashboard-card shadow rounded">
                            <Card.Body>
                                <h5 className="fw-bolder">Căn Hộ</h5>
                                <p className="text-secondary fs-6 p-0">
                                    <FaBuilding className="dashboard-icon apartments" />{" "}
                                    {stats.apartments}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="dashboard-card shadow mb-5 rounded">
                            <Card.Body>
                                <h5 className="fw-bolder">Giao dịch</h5>
                                <p className="text-secondary fs-6 p-0">
                                    <FaHistory className="dashboard-icon transactions" />{" "}
                                    {stats.transactions}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="dashboard-card shadow mb-5 rounded">
                            <Card.Body>
                                <h5 className="fw-bolder">Dịch Vụ</h5>
                                <p className="text-secondary fs-6 p-0">
                                    <FaTools className="dashboard-icon services" />{" "}
                                    {stats.services}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default AdminDashboard;
