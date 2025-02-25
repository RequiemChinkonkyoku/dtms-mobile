import {
    View, Text, TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView,
    Platform, Alert, ActivityIndicator
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { registerAccount } from '../../services/AccountService';
import { RegisterStyles } from '../../styles/RegisterStyles';

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: null
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleRegister = async () => {
        // Validate required fields
        const requiredFields = {
            username: 'Username',
            email: 'Email',
            password: 'Password',
            fullName: 'Full Name',
            phoneNumber: 'Phone Number',
            address: 'Address',
            dateOfBirth: 'Date of Birth',
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field]) {
                Alert.alert('Required Field', `${label} is required`);
                return;
            }
        }

        if (formData.gender === null) {
            Alert.alert('Required Field', 'Gender is required');
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerAccount(formData);
            if (result.success) {
                Alert.alert(
                    'Registration Successful',
                    'Please check your email for the verification code.',
                    [
                        {
                            text: 'OK', onPress: () =>
                                router.push({
                                    pathname: '/verify',
                                    params: { email: formData.email }
                                })
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Registration Failed',
                    result.error || 'An error occurred during registration.'
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to register. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: selectedDate.toISOString().split('T')[0]
            }));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={RegisterStyles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 50}
        >

            {isLoading && (
                <View style={RegisterStyles.loadingOverlay}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
            )}

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <View style={RegisterStyles.contentContainer}>
                    {/* Header */}
                    <View style={RegisterStyles.headerContainer}>
                        <Image
                            source={require('../../assets/images/dog.png')}
                            style={RegisterStyles.logo}
                        />
                        <Text style={RegisterStyles.title}>
                            Create Account
                        </Text>
                        <Text style={RegisterStyles.subtitle}>
                            Join DTMS today
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <TextInput
                        placeholder="Username"
                        value={formData.username}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                        style={RegisterStyles.input}
                    />

                    <TextInput
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={RegisterStyles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        value={formData.password}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                        secureTextEntry
                        style={RegisterStyles.input}
                    />

                    <TextInput
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                        style={RegisterStyles.input}
                    />

                    <TextInput
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                        keyboardType="phone-pad"
                        style={RegisterStyles.input}
                    />

                    <TextInput
                        placeholder="Address"
                        value={formData.address}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                        style={RegisterStyles.input}
                    />

                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={RegisterStyles.input}
                    >
                        <Text style={{ color: formData.dateOfBirth ? '#000' : RegisterStyles.dateText.color }}>
                            {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Date of Birth'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    <View style={RegisterStyles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                            style={{ color: formData.gender === null ? RegisterStyles.pickerText.color : '#000' }}
                        >
                            <Picker.Item label="Select Gender" value={null} />
                            <Picker.Item label="Male" value={0} />
                            <Picker.Item label="Female" value={1} />
                        </Picker>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        style={RegisterStyles.button}
                    >
                        <Text style={RegisterStyles.buttonText}>Create Account</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={RegisterStyles.loginContainer}>
                        <Text style={RegisterStyles.loginText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={RegisterStyles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}