import { useEffect, useState } from "react";
import {
    Container,
    Table,
    Spinner,
    InputGroup,
    FormControl,
    Button,
    Alert,
    Pagination,
    Dropdown,
    Badge,
    Modal
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, banUser, deleteUser } from "../../redux/userSlice";

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users, loading, error, successMessage } = useSelector(
        (state) => state.user
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const usersPerPage = 5;

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleBanUser = (userId) => {
        dispatch(banUser(userId));
    };

    const handleShowModal = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUserId(null);
    };

    const handleConfirmDelete = () => {
        if (selectedUserId) {
            dispatch(deleteUser(selectedUserId));
        }
        handleCloseModal();
    };

    const resetFilters = () => {
        setSearchTerm("");
        setRoleFilter("");
        setStatusFilter("");
        setCurrentPage(1);
    };

    const validUsers = Array.isArray(users) ? users : [];
    const filteredUsers = validUsers.filter((user) => {
        const matchesSearch =
            (user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? (user.role === "Manager" ? "Quản lý" : "Người dùng") === roleFilter : true;
        const matchesStatus = statusFilter ? (user.isActive ? "Hoạt động" : "Bị khóa") === statusFilter : true;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <Container className="user-management-container my-5">
            <h3 className="mb-4">Quản Lý Người Dùng</h3>

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dropdown className="ms-2">
                    <Dropdown.Toggle variant="outline-primary">
                        {roleFilter || "Lọc theo vai trò"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setRoleFilter("")}>Tất cả</Dropdown.Item>
                        <Dropdown.Item onClick={() => setRoleFilter("Quản lý")}>Quản lý</Dropdown.Item>
                        <Dropdown.Item onClick={() => setRoleFilter("Người dùng")}>Người dùng</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="ms-2">
                    <Dropdown.Toggle variant="outline-secondary">
                        {statusFilter || "Lọc theo trạng thái"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setStatusFilter("")}>Tất cả</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter("Hoạt động")}>Hoạt động</Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatusFilter("Bị khóa")}>Bị khóa</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="outline-danger" className="ms-2" onClick={resetFilters}>
                    Xóa bộ lọc
                </Button>
            </InputGroup>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Đang tải danh sách người dùng...</p>
                </div>
            ) : error ? (
                <Alert variant="danger">Lỗi khi tải dữ liệu: {error}</Alert>
            ) : filteredUsers.length === 0 ? (
                <Alert variant="info">Không có người dùng nào.</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai Trò</th>
                                <th>Trạng thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user._id || index}>
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td>{user.name || "N/A"}</td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>
                                        <Badge bg={user.role === "Manager" ? "danger" : "primary"}>
                                            {user.role === "Manager" ? "Quản lý" : "Người dùng"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={user.isActive ? "success" : "secondary"}>
                                            {user.isActive ? "Hoạt động" : "Bị khóa"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant={user.isActive ? "warning" : "success"}
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleBanUser(user._id)}
                                        >
                                            {user.isActive ? "Khóa" : "Mở khóa"}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleShowModal(user._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center">
                        {[...Array(totalPages).keys()].map((num) => (
                            <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                                {num + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa người dùng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;
