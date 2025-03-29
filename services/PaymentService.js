import ApiManager from './ApiManager';

export const createVNPayPayment = async (paymentData) => {
    try {
        const response = await ApiManager.post('/vnpay', {
            orderType: paymentData.orderType,
            amount: paymentData.amount,
            enrollmentId: paymentData.enrollmentId,
            customerID: paymentData.customerID
        });
        
        return {
            success: true,
            data: response.data // This will be the payment URL
        };
    } catch (error) {
        console.error('Error creating VNPay payment:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to create payment'
        };
    }
};

export const checkPaymentStatus = async (vnp_ResponseCode, vnp_TransactionNo) => {
    try {
        const response = await ApiManager.get(`/vnpay/payment-callback`, {
            params: {
                vnp_ResponseCode,
                vnp_TransactionNo
            }
        });
        
        return {
            success: response.data.success,
            data: response.data.object
        };
    } catch (error) {
        console.error('Error checking payment status:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to verify payment'
        };
    }
};