import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "../../assets/fpt-login.jpg";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data Submitted:", formData);
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: "#F7444E" }}
        >
            <Row className="shadow p-4 rounded d-flex align-items-center justify-content-center" style={{ width: "50vw", height: "30vw", backgroundColor: "#F7F8F3" }}>
                <Col md={6} className="d-none d-md-block p-0">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="img-fluid w-200 h-200 rounded-start"
                        style={{ objectFit: "cover" }}
                    />
                </Col>
                <Col md={6} className="d-flex flex-column justify-content-center">
                    <h3 className="text-center mb-4">Login</h3>
                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                        <Form.Group className="mb-3 w-100">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-100">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mb-3 w-100">
                            <a href="/forgot-password" style={{ textDecoration: "none", color: "#F7444E" }}>
                                Forgot Password?
                            </a>
                            <a href="/register" style={{ textDecoration: "none", color: "#78BCC4" }}>
                                Register
                            </a>
                        </div>
                        <Button style={{ backgroundColor: "#78BCC4" }} type="submit" className="w-100">
                            Login
                        </Button>
                        <div className="text-center mt-3 w-100">
                            <Button variant="light" className="w-100 border" onClick={() => console.log("Login with Google")}>
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
