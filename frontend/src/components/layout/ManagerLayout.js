import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ManagerSideBar from "../sidebar/ManagerSideBar";
import "../../assets/css/ManagerLayout.css";

const ManagerLayout = () => {
    return (
        <>
            <Container fluid className="mt-5 pt-4 admin-container">
                <Row>
                    <Col md={3} className="p-0 admin-sidebar">
                        <ManagerSideBar />
                    </Col>
                    <Col md={9} className="p-0 admin-content">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ManagerLayout;
