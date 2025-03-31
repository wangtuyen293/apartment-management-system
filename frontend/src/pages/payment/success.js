import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveTransaction } from '../../redux/paymentSlice';
import { useDispatch, useSelector } from 'react-redux';

const Success = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { user } = useSelector((state) => state.auth);

    const orderCode = searchParams.get('orderCode');
    console.log(orderCode)

    const handleBackToHome = () => {
        dispatch(saveTransaction({ orderCode: orderCode, userId: user._id }));
        navigate('/home');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Thanh Toán Thành Công!</h1>
            <p style={styles.message}>
                Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.
            </p>
            <button style={styles.button} onClick={handleBackToHome}>
                Về Trang Chủ
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
    },
    header: {
        color: '#28a745',
        fontSize: '2.5rem',
        marginBottom: '1rem',
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '2rem',
        color: '#333',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Success;