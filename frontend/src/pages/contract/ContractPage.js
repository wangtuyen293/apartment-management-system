import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApartment } from "../../redux/apartmentSlice";
import { userExtendContract, terminateContract } from "../../redux/apartmentSlice";
import {
    Container,
    Button,
    Card,
    Badge,
    Row,
    Col,
    Modal, Form
} from "react-bootstrap";
import {
    Calendar,
    CreditCard,
    FileText,
    HouseDoor,
} from "react-bootstrap-icons";

const ContractPage = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { apartment, loading, error } = useSelector(state => state.apartment);

    useEffect(() => {
        dispatch(getApartment());
    }, [dispatch]);

    const [showExtendModal, setShowExtendModal] = useState(false);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [extendDate, setExtendDate] = useState("");
    const [extendDuration, setExtendDuration] = useState(1);

    const handleExtendClick = (contract) => {
        setSelectedContract(contract);
        setShowExtendModal(true);
    };

    const handleTerminateClick = (contract) => {
        setSelectedContract(contract);
        setShowTerminateModal(true);
    };

    const handleExtendSubmit = () => {
        if (!extendDate || extendDuration < 1) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const payload = {
            id: selectedContract?._id,
            extendDate,
            extendDuration,
        };

        dispatch(userExtendContract(payload))
            .then(() => {
                alert("Yêu cầu gia hạn hợp đồng đã được gửi thành công!");
                setShowExtendModal(false);
            })
            .catch((error) => {
                console.error("Lỗi khi gửi yêu cầu gia hạn:", error);
                alert("Đã xảy ra lỗi khi gửi yêu cầu gia hạn!");
            });
    };

    const handleTerminateSubmit = () => {
        if (!selectedContract) {
            alert("Không tìm thấy hợp đồng để dừng!");
            return;
        }

        const payload = {
            id: selectedContract?._id,
        };

        dispatch(terminateContract(payload))
            .then(() => {
                alert("Hợp đồng đã được gửi để xem xét dừng thành công!");
                setShowTerminateModal(false);
            })
            .catch((error) => {
                console.error("Lỗi khi dừng hợp đồng:", error);
                alert("Đã xảy ra lỗi khi dừng hợp đồng!");
            });
    };

    const userApartments = apartment?.filter(apartment => apartment.tenantId?._id === user?._id) || [];
    console.log(userApartments)

    const checkStatus = (startRentDate, endRentDate) => {
        const today = new Date();
        const startDate = new Date(startRentDate);
        const endDate = new Date(endRentDate);

        if (today < startDate) {
            return "Chưa bắt đầu";
        } else if (today > endDate) {
            return "Đã hết hạn";
        } else {
            return "Đang hiệu lực";
        }
    }

    const formatDay = (day) => {
        const date = new Date(day);
        return date.toLocaleDateString('vi-VN');
    };

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

                {userApartments.map((contract) => (
                    <Card key={contract.id} className="mb-3 border">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h5 className="mb-0">{contract.title}</h5>
                                <span className="text-muted small">
                                    <strong>Căn hộ số: {contract.apartmentNumber}</strong>
                                </span>
                            </div>
                            <Badge
                                bg={
                                    checkStatus(contract.startRentDate, contract.endRentDate) === "Chưa bắt đầu" ? "secondary" :
                                        checkStatus(contract.startRentDate, contract.endRentDate) === "Đã hết hạn" ? "danger" : "success"

                                }
                                pill
                            >
                                {contract.status === "Đã cho thuê" ? "Đang thuê" : "Chưa cho thuê"}
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
                                                {formatDay(contract.startRentDate)} -{" "}
                                                {formatDay(contract.endRentDate)}
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
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="bg-white border-top d-flex justify-content-between py-3">
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleExtendClick(contract)}
                            >
                                Yêu cầu gia hạn
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleTerminateClick(contract)}
                            >
                                Dừng hợp đồng
                            </Button>
                        </Card.Footer>
                    </Card>
                ))}

                <Modal show={showExtendModal} onHide={() => setShowExtendModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Yêu cầu gia hạn hợp đồng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label><strong>Căn hộ số: {selectedContract?.apartmentNumber}</strong></Form.Label>
                            <Form.Group controlId="extendDate" className="mt-3">
                                <Form.Label>Ngày bắt đầu gia hạn</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={extendDate}
                                    onChange={(e) => setExtendDate(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="extendDuration" className="mt-3">
                                <Form.Label>Thời gian gia hạn (tháng)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    value={extendDuration}
                                    onChange={(e) => setExtendDuration(e.target.value)}
                                    placeholder="Nhập số tháng"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowExtendModal(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (!extendDate || extendDuration < 1) {
                                    alert("Vui lòng nhập đầy đủ thông tin!");
                                    return;
                                }
                                handleExtendSubmit();
                            }}
                        >
                            Gửi yêu cầu
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showTerminateModal} onHide={() => setShowTerminateModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Dừng hợp đồng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Bạn có chắc chắn muốn dừng hợp đồng này không?</p>
                        <p><strong>Căn hộ số:</strong> {selectedContract?.apartmentNumber}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTerminateModal(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                if (!selectedContract) {
                                    alert("Không tìm thấy hợp đồng để dừng!");
                                    return;
                                }
                                handleTerminateSubmit();
                            }}
                        >
                            Dừng hợp đồng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default ContractPage;
