import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../../assets/images/fpt-login.jpg";
import { registerUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);

    const validateInputs = () => {
        let newErrors = {};

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be 10 digits";
        }

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(
                formData.password
            )
        ) {
            newErrors.password =
                "Password must be at least 8 characters with one uppercase, one lowercase, and one number";
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateInputs()) {
            dispatch(registerUser(formData));
        }
    };

    useEffect(() => {
        if (user) {
            setSuccessMessage(
                "Registration successful! Please verify your email!"
            );
        }
    }, [user, navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 mt-5 py-5"
            style={{ backgroundColor: "#F7444E" }}
        >
            <Row
                className="shadow p-4 rounded"
                style={{ maxWidth: "50vw", backgroundColor: "#F7F8F3" }}
            >
                <Col md={6} className="d-none d-md-block p-0">
                    <img
                        src={loginImage}
                        alt="Registration"
                        className="img-fluid w-100 h-100 rounded-start"
                        style={{ objectFit: "cover" }}
                    />
                </Col>
                <Col md={6}>
                    <h3 className="text-center mb-4">Registration Form</h3>
                    {successMessage && (
                        <Alert variant="success">{successMessage}</Alert>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <p className="text-danger">{errors.email}</p>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                            {errors.phoneNumber && (
                                <p className="text-danger">
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && (
                                <p className="text-danger">{errors.password}</p>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && (
                                <p className="text-danger">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </Form.Group>
                        <Button
                            style={{ backgroundColor: "#78BCC4" }}
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationForm;
