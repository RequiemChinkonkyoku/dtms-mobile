import ApiManager from './ApiManager';
import { router } from 'expo-router';

export const createVNPayPayment = async (paymentData) => {
    try {
        const response = await ApiManager.post('/vnpay', {
            orderType: paymentData.orderType,
            amount: paymentData.amount,
            enrollmentId: paymentData.enrollmentId,
            customerID: paymentData.customerID
        });
        
        if (response.data) {
            // Navigate to WebView with payment URL
            router.push({
                pathname: '/payment/payment-webview',
                params: { paymentUrl: encodeURIComponent(response.data) }
            });
        }

        return {
            success: true,
            data: response.data
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
        // For VNPay, '00' means success
        if (vnp_ResponseCode === '00') {
            return {
                success: true,
                data: {
                    message: 'Payment processed successfully',
                    transactionNo: vnp_TransactionNo
                }
            };
        }

        // If response code is not '00', consider it a failed payment
        return {
            success: false,
            error: 'Payment was not successful'
        };
    } catch (error) {
        console.error('Error checking payment status:', error);
        // Even if API call fails, if we have a successful response code, consider it successful
        if (vnp_ResponseCode === '00') {
            return {
                success: true,
                data: {
                    message: 'Payment processed successfully',
                    transactionNo: vnp_TransactionNo
                }
            };
        }
        return {
            success: false,
            error: 'Failed to verify payment'
        };
    }
};