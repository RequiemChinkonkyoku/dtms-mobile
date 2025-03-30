import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { View } from 'react-native';
import { checkPaymentStatus } from '../../services/PaymentService';

export default function PaymentWebView() {
    const { paymentUrl } = useLocalSearchParams();

    const handleNavigationStateChange = async (navState) => {
        // Check if the URL contains payment callback parameters
        if (navState.url.includes('payment-callback')) {
            const url = new URL(navState.url);
            const vnp_ResponseCode = url.searchParams.get('vnp_ResponseCode');
            const vnp_TransactionNo = url.searchParams.get('vnp_TransactionNo');

            if (vnp_ResponseCode && vnp_TransactionNo) {
                const paymentStatus = await checkPaymentStatus(vnp_ResponseCode, vnp_TransactionNo);
                
                if (paymentStatus.success) {
                    alert("Payment Successful! Your enrollment is confirmed.");
                    router.push("/home");
                } else {
                    alert("Payment Failed. Please try again.");
                    router.push("/home");
                }
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: decodeURIComponent(paymentUrl) }}
                onNavigationStateChange={handleNavigationStateChange}
                style={{ flex: 1 }}
            />
        </View>
    );
}