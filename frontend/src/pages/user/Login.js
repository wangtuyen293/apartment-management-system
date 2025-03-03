import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../assets/fpt-login.jpg";

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken, username, loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/v1/auth/google";
    };

    useEffect(() => {
        if (accessToken) {
            navigate("/home");
        }
    }, [accessToken, navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
        >
            <Row
                className="shadow-lg rounded overflow-hidden"
                style={{ maxWidth: "900px" }}
            >
                <Col md={6} className="p-0 d-none d-md-block">
                    <motion.img
                        src={loginImage}
                        alt="Login"
                        className="w-100 h-100 object-fit-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                </Col>
                <Col
                    md={6}
                    className="p-5 bg-white d-flex flex-column justify-content-center"
                >
                    <h3 className="text-center mt-4 mb-5">Welcome Back!</h3>
                    {error && (
                        <p className="text-danger text-center">{error}</p>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
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
                        <div className="d-flex justify-content-between mb-3">
                            <a href="/forgot-password" className="text-danger text-decoration-none text-decoration-underline-hover">
                                Forgot Password?
                            </a>
                            <a href="/register" className="text-primary text-decoration-none">
                                Register
                            </a>
                        </div>
                        <Button
                            type="submit"
                            className="w-100 mb-2"
                            variant="danger"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="w-100 d-flex align-items-center justify-content-center"
                            onClick={handleGoogleLogin}
                        >
                            <FcGoogle size={24} className="me-2" /> Login with
                            Google
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
