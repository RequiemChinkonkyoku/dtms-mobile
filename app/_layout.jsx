import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { NotificationProvider } from '../contexts/NotificationContext';

function ProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {

    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync('user_token');
      console.log('Current Auth State:', {
        isAuthenticated,
        token,
        currentSegment: segments[0],
        loading
      });
    };

    if (!loading) {
      checkAuthStatus();
      const inAuthGroup = segments[0] === '(auth)';
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/login');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/home');
      }
    }
  }, [isAuthenticated, loading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProtectedRoute />
        <Stack screenOptions={{ headerShown: false }} />
      </NotificationProvider>
    </AuthProvider>
  );
}