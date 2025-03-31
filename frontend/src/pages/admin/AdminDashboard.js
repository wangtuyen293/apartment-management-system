import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaUsers, FaBuilding, FaHistory, FaTools } from "react-icons/fa";
import "../../assets/css/AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        apartments: 0,
        transactions: 0,
        services: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve({
                            users: 120,
                            apartments: 50,
                            transactions: 200,
                            services: 30,
                        });
                    }, 1000)
                );
                setStats(response);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                                    {stats.users}
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
