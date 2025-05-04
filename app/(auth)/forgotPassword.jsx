import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { forgotPassword, resetPassword } from '../../services/AccountService';
import { styles } from '../../styles/ForgotPasswordStyles';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer
    const router = useRouter();

    useEffect(() => {
        let timer;
        if (showResetForm && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setShowResetForm(false);
            setOtpCode('');
            setNewPassword('');
            Alert.alert(
                'Time Expired',
                'The OTP code has expired. Please request a new one.',
                [{ text: 'OK' }]
            );
        }
        return () => clearInterval(timer);
    }, [showResetForm, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Required Field', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setTimeLeft(15 * 60);
                setShowResetForm(true);
                Alert.alert('Success', result.message);
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to process request. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (timeLeft === 0) {
            Alert.alert('Time Expired', 'Please request a new OTP code');
            return;
        }

        if (!otpCode || !newPassword) {
            Alert.alert('Required Fields', 'Please enter both OTP code and new password');
            return;
        }

        setIsLoading(true);
        try {
            const result = await resetPassword(email, otpCode, newPassword);
            if (result.success) {
                Alert.alert('Success', result.message, [
                    { text: 'OK', onPress: () => router.push('/login') }
                ]);
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to reset password. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}

            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/images/dog.png')}
                    style={styles.logo}
                />

                <View style={styles.headerContainer}>
                    <Text style={styles.title}>
                        {showResetForm ? 'Reset Password' : 'Forgot Password'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {showResetForm
                            ? 'Enter the OTP code sent to your email and your new password'
                            : 'Enter your email address to receive a password reset code'}
                    </Text>
                </View>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!showResetForm}
                    style={styles.input}
                />

                {showResetForm && (
                    <>
                        <TextInput
                            placeholder="OTP Code"
                            value={otpCode}
                            onChangeText={setOtpCode}
                            style={styles.input}
                        />

                        <Text style={[
                            styles.timerText,
                            { color: timeLeft <= 300 ? '#ff3b30' : '#666' }
                        ]}>
                            Time remaining: {formatTime(timeLeft)}
                        </Text>

                        <TextInput
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </>
                )}

                <TouchableOpacity
                    onPress={showResetForm ? handleResetPassword : handleForgotPassword}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        {showResetForm ? 'Reset Password' : 'Send Reset Code'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>
                        Back to Login
                    </Text>
                </TouchableOpacity>

                {showResetForm && timeLeft === 0 && (
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.resendButton}
                    >
                        <Text style={styles.resendButtonText}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}