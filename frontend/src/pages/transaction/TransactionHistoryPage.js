import { useSelector } from "react-redux";
import { Container, Form, Button, Table, Badge } from "react-bootstrap";

const TransactionHistoryPage = () => {
    // const { transactions } = useSelector((state) => state.transaction);

    const transactions = [
        {
            id: 1,
            date: "01/03/2025",
            type: "Thanh toán tiền thuê",
            amount: "9,500,000",
            status: "Thành công",
        },
        {
            id: 2,
            date: "01/02/2025",
            type: "Thanh toán tiền điện",
            amount: "1,200,000",
            status: "Thành công",
        },
        {
            id: 3,
            date: "01/02/2025",
            type: "Thanh toán tiền nước",
            amount: "350,000",
            status: "Thành công",
        },
        {
            id: 4,
            date: "01/01/2025",
            type: "Thanh toán tiền thuê",
            amount: "9,500,000",
            status: "Thành công",
        },
        {
            id: 5,
            date: "15/12/2024",
            type: "Đặt cọc",
            amount: "19,000,000",
            status: "Thành công",
        },
    ];

    return (
        <>
        <Container className="mt-5">
            <div className="mb-4">
                <h3 className="mb-3">Lịch Sử Giao Dịch</h3>
                <div>
                    <Form.Select
                        className="d-inline-block me-2"
                        style={{ width: "150px" }}
                    >
                        <option>Tất cả</option>
                        <option>Tiền thuê</option>
                        <option>Tiền điện</option>
                        <option>Tiền nước</option>
                    </Form.Select>
                    <Button variant="outline-primary" size="sm">
                        Lọc
                    </Button>
                </div>
            </div>

            <Table responsive hover className="align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Mã GD</th>
                        <th>Ngày Thanh Toán</th>
                        <th>Loại giao dịch</th>
                        <th>Số tiền (VND)</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id}>
                            <td>#{tx.id.toString().padStart(6, "0")}</td>
                            <td>{tx.date}</td>
                            <td>{tx.type}</td>
                            <td className="fw-bold">{tx.amount}</td>
                            <td>
                                <Badge bg="success" pill>
                                    {tx.status}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 text-decoration-none"
                                >
                                    Chi tiết
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="text-center mt-4">
                <Button variant="outline-primary" className="px-4">
                    Xem thêm
                </Button>
            </div>
        </Container>
        </>
    );

    // return (
    //     <Container className="mt-5">
    //         <h3>Lịch Sử Giao Dịch</h3>
    //         <Table striped bordered hover className="mt-5">
    //             <thead>
    //                 <tr>
    //                     <th>#</th>
    //                     <th>Mã Giao Dịch</th>
    //                     <th>Số Tiền</th>
    //                     <th>Ngày Thanh Toán</th>
    //                     <th>Trạng Thái</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {/* {transactions.map((transaction, index) => (
    //                     <tr key={transaction.id}>
    //                         <td>{index + 1}</td>
    //                         <td>{transaction.transactionId}</td>
    //                         <td>{transaction.amount} VND</td>
    //                         <td>{transaction.date}</td>
    //                         <td>{transaction.status}</td>
    //                     </tr>
    //                 ))} */}
    //             </tbody>
    //         </Table>
    //     </Container>
    // );
};

export default TransactionHistoryPage;
