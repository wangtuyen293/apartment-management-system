import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/home');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Thanh Toán Đã Bị Hủy</h1>
            <p style={styles.message}>
                Giao dịch thanh toán đặt cọc căn hộ của bạn đã bị hủy. Vui lòng thử lại nếu cần.
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
        color: '#dc3545',
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

export default Cancel;