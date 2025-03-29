import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, forgotPassword } from "../../redux/passwordSlice";
import { Alert, Button, Container, Spinner, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.password);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <Container className="auth-container my-5 py-5">
            <h2 className="mb-5">Forgot Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="mt-3 w-100">
                    {loading ? <Spinner animation="border" size="sm" /> : "Send Reset Password Link"}
                </Button>
            </Form>
            <div className="mt-3 text-center">
                <Link to="/login">Back to Login</Link>
            </div>
        </Container>
    );
};

export default ForgotPassword;
