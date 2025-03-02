import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import loginImage from "../assets/images/fpt-login.jpg";
import "../assets/css/AuthPage.css";

const AuthPage = () => {
    return (
        <Container fluid className="auth-container">
            <Row className="auth-row">
                <Col md={6} className="auth-bg p-0">
                    <img
                        src={loginImage}
                        alt="Auth"
                        className="w-100 h-100 object-fit-cover"
                    />
                </Col>

                <Col md={6} className="auth-form">
                    <div className="form-container">
                        <Outlet />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AuthPage;
