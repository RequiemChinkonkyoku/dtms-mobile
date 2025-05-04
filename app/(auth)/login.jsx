import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginAccount } from '../../services/AccountService';
import { useAuth } from '../../contexts/AuthContext';
import { decodeToken } from "../../utils/TokenUtils";
import { styles } from '../../styles/LoginStyles';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing fields', 'Please enter both email and password');
            return;
        }
        setIsLoading(true);
        try {
            const result = await loginAccount({ email, password });
            if (result.success) {
                const decodedToken = decodeToken(result.token);
                const userRole = decodedToken.role;
                // Check if user has allowed role
                if (userRole.includes('Customer') || userRole.includes('Trainer')) {
                    await login(result.token);
                    router.replace('/(tabs)/home');
                } else {
                    Alert.alert(
                        'Access Denied', 
                        'Only customers and trainers can access the mobile application.'
                    );
                }
            } else {
                Alert.alert('Login Failed', result?.error || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to login. Please try again.');
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
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../assets/images/dog.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue to P.A.W</Text>
                </View>

                <View style={styles.formSection}>
                    <View>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.signInButton}
                    >
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.additionalOptions}>
                    <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpSection}>
                        <Text style={styles.signUpText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}