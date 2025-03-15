import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../assets/css/AppFooter.css";

const AppFooter = () => {
    return (
        <footer className="footer bg-dark text-light py-4 mt-5">
            <Container>
                <Row>
                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold">FPT PLAZA</h5>
                        <p>Quản lý căn hộ dễ dàng, nhanh chóng và hiệu quả.</p>
                    </Col>

                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold mb-3">Liên kết nhanh</h5>
                        <ul className="list-unstyled d-flex flex-column gap-1">
                            <li><Link to="/" className="footer-link">Trang Chủ</Link></li>
                            <li><Link to="/about" className="footer-link">Giới Thiệu</Link></li>
                            <li><Link to="/contact" className="footer-link">Liên Hệ</Link></li>
                            <li><Link to="/faq" className="footer-link">Hỏi Đáp</Link></li>
                        </ul>
                    </Col>

                    <Col md={4} className="mb-3">
                        <h5 className="fw-bold mb-3">Liên Hệ</h5>
                        <p className="mb-1">Email: support@fptplaza.com</p>
                        <p>Phone: +84 123 456 789</p>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><FaFacebook /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaLinkedin /></a>
                        </div>
                    </Col>
                </Row>

                <hr className="bg-light" />

                <Row>
                    <Col className="text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} FPT PLAZA. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default AppFooter;
