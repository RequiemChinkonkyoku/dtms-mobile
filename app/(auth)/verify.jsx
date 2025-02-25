import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOTP } from '../../services/AccountService';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP code');
      return;
    }

    const result = await verifyOTP(email, otp);
    if (result.success) {
      Alert.alert('Success', result.message, [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } else {
      Alert.alert('Error', result.error);
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
        alignItems: 'center',
      }}>
        <Image
          source={require('../../assets/images/dog.png')}
          style={{
            width: 100,
            height: 100,
            marginBottom: 30,
          }}
        />
        
        <View style={{
          alignItems: 'center',
          marginBottom: 30,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 10,
          }}>
            Verify Your Account
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            paddingHorizontal: 30,
            lineHeight: 22,
          }}>
            We've sent a verification code to {email}.{'\n'}Please enter it below.
          </Text>
        </View>

        <TextInput
          placeholder="Enter OTP Code"
          value={otp}
          onChangeText={setOtp}
          autoCapitalize="characters"
          maxLength={7}
          style={{
            backgroundColor: '#f5f5f5',
            padding: 15,
            borderRadius: 10,
            fontSize: 20,
            width: '80%',
            textAlign: 'center',
            letterSpacing: 5,
            marginBottom: 20,
          }}
        />

        <Text style={{
          fontSize: 16,
          color: timeLeft <= 300 ? '#ff3b30' : '#666', // Red color for last 5 minutes
          marginBottom: 20,
        }}>
          Time remaining: {formatTime(timeLeft)}
        </Text>

        <TouchableOpacity
          onPress={handleVerify}
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            width: '80%',
          }}
        >
          <Text style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
          }}>
            Verify Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 20,
          }}
          disabled={timeLeft > 0}
        >
          <Text style={{
            color: timeLeft > 0 ? '#999' : '#007AFF',
            fontSize: 15,
          }}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}