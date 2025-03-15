import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import { fetchUser } from "../../redux/authSlice";
import "../../assets/css/ProfilePage.css";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        }
    }, [dispatch, user]);

    return (
        <>
            <Container className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Thông tin cá nhân</h3>
                </div>

                <Row>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-muted">
                                Họ và tên
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={user?.name || ""}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-muted">
                                Tên người dùng
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={user?.username || ""}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-muted">
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-muted">
                                Số điện thoại
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                value={user?.phoneNumber || ""}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                        <Form.Group>
                            <Form.Label className="text-muted">
                                Địa chỉ
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={user?.address || ""}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex mt-3">
                    <Button variant="outline-secondary" className="me-2">
                        Cập Nhật
                    </Button>
                </div>
            </Container>
        </>
    );
};

export default ProfilePage;
