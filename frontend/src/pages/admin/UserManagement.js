import { useEffect, useState } from "react";
import {
    Container,
    Table,
    Spinner,
    InputGroup,
    FormControl,
    Button,
    Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/userSlice";

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const validUsers = Array.isArray(users) ? users : [];

    const filteredUsers = validUsers.filter(
        (user) =>
            (user?.name?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            ) ||
            (user?.email?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            )
    );

    return (
        <Container className="user-management-container my-5">
            <h3 className="mb-4">Quản Lý Người Dùng</h3>

            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">Tìm kiếm</Button>
            </InputGroup>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Đang tải danh sách người dùng...</p>
                </div>
            ) : error ? (
                <Alert variant="danger">Lỗi khi tải dữ liệu: {error}</Alert>
            ) : validUsers.length === 0 ? (
                <Alert variant="info">Không có người dùng nào.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai Trò</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={user._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{user.name || "N/A"}</td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>{user.role === "Manager" ? "Quản lý" : "Người dùng"}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2">Khóa tài khoản</Button>
                                        <Button variant="danger" size="sm">Xóa</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Không tìm thấy kết quả nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserManagement;
