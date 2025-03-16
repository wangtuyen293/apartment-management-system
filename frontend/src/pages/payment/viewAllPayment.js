import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Spinner, Row, Col, Card, Button, Form, InputGroup, Badge, Dropdown, DropdownButton, Table, Pagination
} from "react-bootstrap";
import {
    Search, Filter, CurrencyDollar, SquareFill, SortDown, CheckCircleFill, XCircleFill, Calendar, Clock
} from "react-bootstrap-icons";
import { logoutUser } from "../../redux/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from "../../components/SideBar";
import { BillPayment, getAllPayment } from "../../redux/paymentSlice";

const ViewAllPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [bills, setBills] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("billing_date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 10;

    // Sửa useSelector để lấy đúng bill
    const { bill, loading, error } = useSelector(state => state.payment || { bill: [], loading: false, error: null });
    const user = useSelector(state => state.auth.user) || { name: "Người dùng" };

    useEffect(() => {
        setIsLoading(true);
        dispatch(getAllPayment({ id: user.id }))
            .unwrap()
            .then((result) => {
                console.log("Fetched bills:", result); // Debug dữ liệu
                setBills(result || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching bills:", err); // Debug lỗi
                setIsLoading(false);
            });
    }, [dispatch, user.id]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const handleSort = (criteria) => {
        if (sortBy === criteria) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(criteria);
            setSortOrder("asc");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleStatus = () => {

    }

    const handlePayment = (id) => {
        console.log(id);
        dispatch(BillPayment({ id }))
            .then((resultAction) => {
                if (BillPayment.fulfilled.match(resultAction)) {
                    const checkoutUrl = resultAction.payload.checkoutUrl;
                    window.location.href = checkoutUrl;
                } else if (BillPayment.rejected.match(resultAction)) {

                    console.error("Payment error:", resultAction.payload);
                }
            })
            .catch((error) => {
                console.error("Unexpected error:", error);
            });
    }

    const filteredBills = bills.filter(bill => {
        const matchesSearch =
            bill.typeOfPaid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.apartment_id.apartment_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || bill.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const sortedBills = filteredBills.sort((a, b) => {
        if (sortBy === "fee") {
            return sortOrder === "asc" ? a.fee - b.fee : b.fee - a.fee;
        } else if (sortBy === "billing_date") {
            return sortOrder === "asc"
                ? new Date(a.billing_date) - new Date(b.billing_date)
                : new Date(b.billing_date) - new Date(a.billing_date);
        } else if (sortBy === "apartment_number") {
            return sortOrder === "asc"
                ? a.apartment_id.apartment_number.localeCompare(b.apartment_id.apartment_number)
                : b.apartment_id.apartment_number.localeCompare(a.apartment_id.apartment_number);
        }
        return 0;
    });

    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = sortedBills.slice(indexOfFirstBill, indexOfLastBill);
    const totalPages = Math.ceil(sortedBills.length / billsPerPage);

    const renderStatus = (status) => {
        switch (status.toLowerCase()) {
            case "paid":
                return <Badge bg="success"><CheckCircleFill className="me-1" /> Đã thanh toán</Badge>;
            case "unpaid":
                return <Badge bg="warning" text="dark"><Clock className="me-1" /> Chưa thanh toán</Badge>;
            default:
                return <Badge bg="secondary">Không xác định</Badge>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.getMonth() + 1;
    };

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return (
            <Pagination className="mt-3 justify-content-center">
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                />
                {items}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                />
            </Pagination>
        );
    };

    return (
        <Container fluid className="p-0" style={{ backgroundColor: "#F5F7FA" }}>
            <Row className="g-0">
                <Sidebar user={user} handleProfileRedirect={handleProfileRedirect} handleLogout={handleLogout} />

                <Col xs={10} className="p-0 ms-auto" style={{ marginLeft: "16.67%" }}>
                    <div className="d-flex flex-column min-vh-100">
                        <div className="bg-white p-3 border-bottom">
                            <Row className="align-items-center">
                                <Col>
                                    <h4 className="mb-0"><CurrencyDollar className="text-primary me-2" />Danh Sách Hóa Đơn</h4>
                                </Col>
                            </Row>
                        </div>

                        <div className="p-4">
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white">
                                    <Row className="align-items-center">
                                        <Col md={6} className="mb-3 mb-md-0">
                                            <InputGroup>
                                                <InputGroup.Text id="search-addon">
                                                    <Search />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Tìm kiếm hóa đơn..."
                                                    value={searchTerm}
                                                    onChange={handleSearch}
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex justify-content-md-end">
                                                <DropdownButton
                                                    variant="outline-secondary"
                                                    title={<><Filter className="me-1" /> Trạng thái</>}
                                                    className="me-2"
                                                >
                                                    <Dropdown.Item
                                                        active={filterStatus === "all"}
                                                        onClick={() => handleFilterChange("all")}
                                                    >
                                                        Tất cả
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={filterStatus === "unpaid"}
                                                        onClick={() => handleFilterChange("unpaid")}
                                                    >
                                                        <SquareFill className="me-1 text-warning" /> Chưa thanh toán
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={filterStatus === "paid"}
                                                        onClick={() => handleFilterChange("paid")}
                                                    >
                                                        <SquareFill className="me-1 text-success" /> Đã thanh toán
                                                    </Dropdown.Item>
                                                </DropdownButton>

                                                <DropdownButton
                                                    variant="outline-secondary"
                                                    title={<><SortDown className="me-1" /> Sắp xếp</>}
                                                >
                                                    <Dropdown.Item
                                                        active={sortBy === "billing_date" && sortOrder === "asc"}
                                                        onClick={() => handleSort("billing_date")}
                                                    >
                                                        Ngày lập hóa đơn (tăng dần)
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={sortBy === "billing_date" && sortOrder === "desc"}
                                                        onClick={() => handleSort("billing_date")}
                                                    >
                                                        Ngày lập hóa đơn (giảm dần)
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={sortBy === "fee" && sortOrder === "asc"}
                                                        onClick={() => handleSort("fee")}
                                                    >
                                                        Phí (tăng dần)
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={sortBy === "fee" && sortOrder === "desc"}
                                                        onClick={() => handleSort("fee")}
                                                    >
                                                        Phí (giảm dần)
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={sortBy === "apartment_number" && sortOrder === "asc"}
                                                        onClick={() => handleSort("apartment_number")}
                                                    >
                                                        Số căn hộ (A-Z)
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        active={sortBy === "apartment_number" && sortOrder === "desc"}
                                                        onClick={() => handleSort("apartment_number")}
                                                    >
                                                        Số căn hộ (Z-A)
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {isLoading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2">Đang tải dữ liệu...</p>
                                        </div>
                                    ) : currentBills.length === 0 ? (
                                        <div className="text-center py-5">
                                            <p className="mb-0">Không tìm thấy hóa đơn nào phù hợp.</p>
                                        </div>
                                    ) : (
                                        <Table responsive hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th onClick={() => handleSort("typeOfPaid")} style={{ cursor: "pointer" }}>
                                                        Loại phí {sortBy === "typeOfPaid" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th onClick={() => handleSort("fee")} style={{ cursor: "pointer" }}>
                                                        Phí {sortBy === "fee" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th onClick={() => handleSort("billing_date")} style={{ cursor: "pointer" }}>
                                                        Tháng {sortBy === "billing_date" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th onClick={() => handleSort("apartment_number")} style={{ cursor: "pointer" }}>
                                                        Căn hộ {sortBy === "apartment_number" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th>Trạng thái</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentBills.map(bill => (
                                                    <tr key={bill._id}>
                                                        <td>{bill.typeOfPaid}</td>
                                                        <td className="fw-bold">{formatCurrency(bill.fee)}</td>
                                                        <td><Calendar className="me-1" />{formatDate(bill.billing_date)}</td>
                                                        <td>{bill.apartment_id.apartmentNumber}</td>
                                                        <td>{renderStatus(bill.status)}</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="me-1"
                                                                hidden={bill.status === "Paid"}
                                                                onClick={() => handlePayment(bill._id)}
                                                            >
                                                                Thanh toán
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                                <Card.Footer className="bg-white">
                                    <Row className="align-items-center">
                                        <Col>
                                            <small className="text-muted">
                                                Hiển thị {currentBills.length} trên tổng số {sortedBills.length} hóa đơn
                                            </small>
                                        </Col>
                                        <Col xs="auto">
                                            {renderPagination()}
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewAllPayment;