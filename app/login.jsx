import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginAccount } from '../services/AccountService';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing fields', 'Please enter both email and password');
            return;
        }

        const result = await loginAccount({ email, password });
        if (result.success) {
            try {
                await SecureStore.setItemAsync('user_token', result.token);
                router.push('/home');
            } catch (error) {
                Alert.alert('Error', 'Failed to save authentication token');
            }
        } else {
            Alert.alert(
                'Login Failed',
                result?.error || 'Invalid email or password'
            );
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
                        source={require('../assets/images/dog.png')}
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