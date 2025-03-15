import { useSelector } from "react-redux";
import {
    Container,
    Button,
    Card,
    Badge,
    Row,
    Col,
} from "react-bootstrap";
import {
    Calendar,
    CreditCard,
    FileText,
    HouseDoor,
} from "react-bootstrap-icons";

const ContractPage = () => {
    // const { contracts } = useSelector((state) => state.contract);

    const contracts = [
        {
            id: "CT0001",
            title: "Hợp đồng thuê căn hộ A102",
            startDate: "15/12/2024",
            endDate: "15/12/2025",
            status: "Đang hiệu lực",
            price: "9,500,000",
        },
    ];

    return (
        <>
            <Container className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Hợp đồng căn hộ</h3>
                    <Button variant="outline-primary">
                        <FileText className="me-1" />
                        Tất cả hợp đồng
                    </Button>
                </div>

                {contracts.map((contract) => (
                    <Card key={contract.id} className="mb-3 border">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h5 className="mb-0">{contract.title}</h5>
                                <span className="text-muted small">
                                    Mã hợp đồng: {contract.id}
                                </span>
                            </div>
                            <Badge
                                bg={
                                    contract.status === "Đang hiệu lực"
                                        ? "success"
                                        : "secondary"
                                }
                                pill
                            >
                                {contract.status}
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <Calendar
                                                size={24}
                                                className="text-primary"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-muted small">
                                                Thời hạn hợp đồng
                                            </div>
                                            <div className="fw-medium">
                                                {contract.startDate} -{" "}
                                                {contract.endDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <CreditCard
                                                size={24}
                                                className="text-primary"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-muted small">
                                                Giá thuê hàng tháng
                                            </div>
                                            <div className="fw-medium">
                                                {contract.price} VND
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col xs={12}>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div
                                            className="progress w-75 me-3"
                                            style={{ height: "8px" }}
                                        >
                                            <div
                                                className="progress-bar w-25"
                                                role="progressbar"
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        <span className="text-muted small">
                                            3 tháng / 12 tháng
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="bg-white border-top d-flex justify-content-between py-3">
                            <Button variant="outline-secondary" size="sm">
                                Chi tiết hợp đồng
                            </Button>
                            <Button variant="primary" size="sm">
                                Tải xuống hợp đồng
                            </Button>
                        </Card.Footer>
                    </Card>
                ))}

                <Card className="bg-light border">
                    <Card.Body className="text-center py-4">
                        <HouseDoor size={36} className="text-muted mb-3" />
                        <h5>Đăng ký thuê căn hộ mới</h5>
                        <p className="text-muted">
                            Khám phá danh sách các căn hộ có sẵn và đăng ký thuê
                        </p>
                        <Button variant="primary" className="px-4 mt-2">
                            Xem danh sách căn hộ
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ContractPage;
