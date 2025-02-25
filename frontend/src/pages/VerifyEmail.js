import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import {
    CheckCircleFill,
    ExclamationTriangleFill,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Verifying your email...");

    const calledOnce = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");

            return;
        }

        if (calledOnce.current) return;
        calledOnce.current = true;

        axios
            .get(
                `http://localhost:5000/api/v1/auth/verify-email?token=${token}`
            )
            .then(() => {
                setStatus("success");
                setMessage("Email verified successfully!");
            })
            .catch((error) => {
                console.error(
                    "Verification failed:",
                    error.response?.data || error.message
                );
                setStatus("error");
                setMessage("Verification failed! Invalid or expired token.");
            });
    }, [token, navigate]);

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: "#F7F8F3" }}
        >
            <Card
                className="text-center shadow-lg p-4"
                style={{ width: "400px" }}
            >
                {status === "loading" ? (
                    <>
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Verifying your email...</p>
                    </>
                ) : status === "success" ? (
                    <>
                        <Alert
                            variant="success"
                            className="d-flex align-items-center"
                        >
                            <CheckCircleFill size={24} className="me-2" />
                            {message}
                        </Alert>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </>
                ) : (
                    <Alert
                        variant="danger"
                        className="d-flex align-items-center"
                    >
                        <ExclamationTriangleFill size={24} className="me-2" />
                        {message}
                    </Alert>
                )}
            </Card>
        </Container>
    );
};

export default VerifyEmail;
