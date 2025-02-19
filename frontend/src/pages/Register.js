import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../assets/fpt-login.jpg";
import { registerUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100"
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
                    {error && <p style={{ color: "red" }}>{error}</p>}
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
