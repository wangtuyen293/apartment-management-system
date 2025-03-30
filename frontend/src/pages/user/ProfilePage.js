import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Row, Col, Form, Container, Alert } from "react-bootstrap";
import { setUser } from "../../redux/authSlice";
import {
    fetchUser,
    updateUserProfile,
    uploadAvatar,
} from "../../redux/userSlice";
import "../../assets/css/ProfilePage.css";
import avatarImage from "../../assets/images/avatar/avatar.jpg";
import { Camera } from "react-bootstrap-icons";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [editable, setEditable] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(avatarImage);

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
            const backendUrl = "http://localhost:5000";
            const userAvatar = user.images?.[0]?.url
                ? `${backendUrl}${user.images[0].url}`
                : avatarImage;

            setAvatarPreview(userAvatar);
        }
    }, [dispatch, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
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

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (avatar) {
                const formData = new FormData();
                formData.append("avatar", avatar);
                dispatch(uploadAvatar(formData));
            }

            const response = await dispatch(
                updateUserProfile(profileData)
            ).unwrap();
            dispatch(setUser(response.user));
            dispatch(fetchUser());
            setSuccessMessage("Cập nhật thông tin thành công.");
            setGeneralError("");
            setEditable(false);
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
        const backendUrl = "http://localhost:5000";
        const userAvatar = user.images?.[0]?.url
            ? `${backendUrl}${user.images[0].url}`
            : avatarImage;

        setAvatarPreview(userAvatar);
        setAvatar(null);
        setErrors({});
        setGeneralError("");
        setSuccessMessage("");
        setEditable(false);
    };

    return (
        <Container className="my-5">
            <div className="text-center mb-2">
                <h3 className="mb-5">Thông tin cá nhân</h3>
            </div>

            {generalError && <Alert variant="danger">{generalError}</Alert>}
            {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
            )}

            <Row>
                <Col md={3} className="text-center">
                    <div className="avatar-wrapper">
                        <label
                            htmlFor="avatar-upload"
                            className="avatar-container"
                        >
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="avatar-preview"
                            />
                            <div
                                className="upload-overlay"
                                style={{ cursor: "pointer" }}
                            >
                                <Camera />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/png, image/jpeg"
                            onChange={handleAvatarChange}
                            hidden
                        />
                    </div>
                </Col>
                <Col md={9}>
                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted">
                            Tên người dùng
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={profileData.username}
                            readOnly
                            className="bg-light"
                        />
                        {errors.username && (
                            <Form.Text className="text-danger">
                                {errors.username}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={profileData.email}
                            readOnly
                            className="bg-light"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
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

                    <div className="d-flex mt-3">
                        {!editable ? (
                            <Button
                                variant="outline-primary"
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
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
