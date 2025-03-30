import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ProfileSideBar from "../sidebar/ProfileSideBar";

const ProfileLayout = () => {
    return (
        <>
            <Container fluid className="mt-5 pt-4 profile-container">
                <Row>
                    <Col md={3} className="p-0 profile-sidebar">
                        <ProfileSideBar />
                    </Col>
                    <Col md={9} className="p-0 profile-content">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProfileLayout;
