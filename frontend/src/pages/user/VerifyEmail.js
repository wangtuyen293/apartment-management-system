import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Alert, Button, Form } from "react-bootstrap";
import {
    CheckCircleFill,
    ExclamationTriangleFill,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState("otp");
    const [message, setMessage] = useState(
        "Please enter the OTP sent to your email"
    );
    const navigate = useNavigate();

    const handleVerifyByOTP = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/v1/auth/verify-email`,
                { email, otp }
            );
            setStatus("success");
            setMessage("Email verified successfully!");
            navigate("/login");
        } catch (error) {
            console.error(
                "Verification failed:",
                error.response?.data || error.message
            );
            setStatus("error");
            setMessage("Verification failed! Invalid or expired OTP.");
        }
    };

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
                {status === "otp" ? (
                    <>
                        <Alert
                            variant="info"
                            className="d-flex align-items-center"
                        >
                            {message}
                        </Alert>
                        <Form.Group className="mt-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={handleVerifyByOTP}
                        >
                            Verify by OTP
                        </Button>
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
