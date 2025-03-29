import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { clearMessages, resetPassword } from "../../redux/passwordSlice";
import { Alert, Button, Container, Spinner, Form } from "react-bootstrap";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const { token } = useParams();
    const dispatch = useDispatch();
    const { loading, message, error } = useSelector((state) => state.password);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({ token, newPassword }));
    };

    return (
        <Container className="auth-container my-5 py-5">
            <h2 className="mb-5">Reset Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="success" type="submit" disabled={loading} className="mt-3 w-100">
                    {loading ? <Spinner animation="border" size="sm" /> : "Reset Password"}
                </Button>
            </Form>
            <div className="mt-3 text-center">
                <Link to="/login">Back to Login</Link>
            </div>
        </Container>
    );
};

export default ResetPassword;
