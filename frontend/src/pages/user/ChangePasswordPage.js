import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Form,
    Container,
    Alert,
    InputGroup,
    Col,
} from "react-bootstrap";
import { changePassword } from "../../redux/userSlice";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const validate = () => {
        let newErrors = {};
        if (!passwordData.oldPassword)
            newErrors.oldPassword = "Mật khẩu cũ không được để trống.";
        if (
            !passwordData.newPassword.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        ) {
            newErrors.newPassword =
                "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }
        if (passwordData.newPassword !== passwordData.confirmPassword)
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            dispatch(changePassword(passwordData));
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setSuccessMessage("Thay đổi password thành công.");
            setGeneralError("");
        } catch (error) {
            setGeneralError(
                error.message || "Thay đổi password thất bại. Vui lòng thử lại."
            );
        }
    };

    return (
        <Container className="mt-5">
            <h3>Thay đổi mật khẩu</h3>

            {generalError && <Alert variant="danger">{generalError}</Alert>}
            {successMessage && (
                <Alert variant="success">{successMessage}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>Mật khẩu cũ</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={
                                    showPassword.oldPassword
                                        ? "text"
                                        : "password"
                                }
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handleChange}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() =>
                                    togglePasswordVisibility("oldPassword")
                                }
                            >
                                {showPassword.oldPassword ? (
                                    <EyeSlash />
                                ) : (
                                    <Eye />
                                )}
                            </Button>
                        </InputGroup>
                        {errors.oldPassword && (
                            <Form.Text className="text-danger">
                                {errors.oldPassword}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3"></Col>

                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={
                                    showPassword.newPassword
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleChange}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() =>
                                    togglePasswordVisibility("newPassword")
                                }
                            >
                                {showPassword.newPassword ? (
                                    <EyeSlash />
                                ) : (
                                    <Eye />
                                )}
                            </Button>
                        </InputGroup>
                        {errors.newPassword && (
                            <Form.Text className="text-danger">
                                {errors.newPassword}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3"></Col>

                <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={
                                    showPassword.confirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handleChange}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() =>
                                    togglePasswordVisibility("confirmPassword")
                                }
                            >
                                {showPassword.confirmPassword ? (
                                    <EyeSlash />
                                ) : (
                                    <Eye />
                                )}
                            </Button>
                        </InputGroup>
                        {errors.confirmPassword && (
                            <Form.Text className="text-danger">
                                {errors.confirmPassword}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6} className="mb-3"></Col>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </Button>
            </Form>
        </Container>
    );
};

export default ChangePasswordPage;
