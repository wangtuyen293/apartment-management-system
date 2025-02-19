import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import loginImage from "../assets/fpt-login.jpg";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    }, [token, navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: "#F7444E" }}
        >
            <Row
                className="shadow p-4 rounded d-flex align-items-center justify-content-center"
                style={{
                    width: "50vw",
                    height: "30vw",
                    backgroundColor: "#F7F8F3",
                }}
            >
                <Col md={6} className="d-none d-md-block p-0">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="img-fluid w-200 h-200 rounded-start"
                        style={{ objectFit: "cover" }}
                    />
                </Col>
                <Col
                    md={6}
                    className="d-flex flex-column justify-content-center"
                >
                    <h3 className="text-center mb-4">Login</h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {token && (
                        <p style={{ color: "green" }}>Login successful!</p>
                    )}
                    <Form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column align-items-center"
                    >
                        <Form.Group className="mb-3 w-100">
                            <Form.Control
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-100">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mb-3 w-100">
                            <a
                                href="/forgot-password"
                                style={{
                                    textDecoration: "none",
                                    color: "#F7444E",
                                }}
                            >
                                Forgot Password?
                            </a>
                            <a
                                href="/register"
                                style={{
                                    textDecoration: "none",
                                    color: "#78BCC4",
                                }}
                            >
                                Register
                            </a>
                        </div>
                        <Button
                            style={{ backgroundColor: "#78BCC4" }}
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center mt-3 w-100">
                            <Button
                                variant="light"
                                className="w-100 border"
                                onClick={() => console.log("Login with Google")}
                            >
                                Login with Google
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
