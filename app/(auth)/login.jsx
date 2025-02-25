import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginAccount } from '../../services/AccountService';
import { useAuth } from '../../contexts/AuthContext';

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
                await login(result.token);
                router.replace('/(tabs)/home');
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
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >

            {isLoading && (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}

            <View style={{
                flex: 1,
                padding: 20,
                justifyContent: 'center',
            }}>
                {/* Logo Section */}
                <View style={{
                    alignItems: 'center',
                    marginBottom: 40,
                }}>
                    <Image
                        source={require('../../assets/images/dog.png')}
                        style={{
                            width: 120,
                            height: 120,
                            marginBottom: 20,
                        }}
                    />
                    <Text style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: 10,
                    }}>
                        Welcome Back
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: '#666',
                        textAlign: 'center',
                    }}>
                        Sign in to continue to DTMS
                    </Text>
                </View>

                {/* Form Section */}
                <View style={{ gap: 15 }}>
                    <View>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: 15,
                                borderRadius: 10,
                                fontSize: 16,
                            }}
                        />
                    </View>

                    <View>
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: 15,
                                borderRadius: 10,
                                fontSize: 16,
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        style={{
                            backgroundColor: '#007AFF',
                            padding: 15,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                    >
                        <Text style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Options */}
                <View style={{
                    marginTop: 30,
                    alignItems: 'center',
                    gap: 20,
                }}>
                    <TouchableOpacity>
                        <Text style={{
                            color: '#007AFF',
                            fontSize: 15,
                        }}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: 'row',
                        gap: 5,
                    }}>
                        <Text style={{ color: '#666' }}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/register')}>
                            <Text style={{
                                color: '#007AFF',
                                fontWeight: '600',
                            }}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}