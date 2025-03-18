import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import { setUser } from "../../redux/authSlice";
import { fetchUser, updateUserProfile } from "../../redux/userSlice";
import "../../assets/css/ProfilePage.css";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [editable, setEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        address: "",
        gender: "",
    });

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser());
        } else {
            setProfileData({
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
                gender: user.gender || "",
            });
        }
    }, [dispatch, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let newErrors = {};
        if (!profileData.name.trim()) {
            newErrors.name = "Họ và tên không được để trống.";
        }
        if (!profileData.username.trim()) {
            newErrors.username = "Tên người dùng không được để trống.";
        }
        if (!profileData.phoneNumber.match(/^\d{10,}$/)) {
            newErrors.phoneNumber = "Số điện thoại phải có ít nhất 10 chữ số.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const response = await dispatch(
                updateUserProfile(profileData)
            ).unwrap();
            dispatch(setUser(response.user));
            dispatch(fetchUser());
            setEditable(false);
            setGeneralError("");
        } catch (error) {
            setGeneralError(
                error.message ||
                    "Cập nhật thông tin thất bại. Vui lòng thử lại."
            );
        }
    };

    const handleCancel = () => {
        setProfileData({
            name: user?.name || "",
            username: user?.username || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            address: user?.address || "",
            gender: user?.gender || "",
        });
        setErrors({});
        setGeneralError("");
        setEditable(false);
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0">Thông tin cá nhân</h3>
            </div>

            {generalError && <p className="text-danger">{generalError}</p>}

            <Row>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="text-muted">
                            Họ và tên
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            readOnly={!editable}
                            className={editable ? "" : "bg-light"}
                        />
                        {errors.name && (
                            <Form.Text className="text-danger">
                                {errors.name}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="text-muted">
                            Tên người dùng
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleChange}
                            readOnly={!editable}
                            className={editable ? "" : "bg-light"}
                        />
                        {errors.username && (
                            <Form.Text className="text-danger">
                                {errors.username}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="text-muted">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={profileData.email}
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
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleChange}
                            readOnly={!editable}
                            className={editable ? "" : "bg-light"}
                        />
                        {errors.phoneNumber && (
                            <Form.Text className="text-danger">
                                {errors.phoneNumber}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="text-muted">Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleChange}
                            readOnly={!editable}
                            className={editable ? "" : "bg-light"}
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label className="text-muted">
                            Giới tính
                        </Form.Label>
                        <Form.Select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleChange}
                            disabled={!editable}
                            className={editable ? "" : "bg-light"}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Other">Khác</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex mt-3">
                {!editable ? (
                    <Button
                        variant="outline-secondary"
                        onClick={() => setEditable(true)}
                    >
                        Cập Nhật
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="success"
                            className="me-2"
                            onClick={handleSave}
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                    </>
                )}
            </div>
        </Container>
    );
};

export default ProfilePage;
