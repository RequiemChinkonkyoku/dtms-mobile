import { Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { userInfo, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.role) {
      const isTrainer = userInfo.role.includes('Trainer');
      console.log('Is Trainer:', isTrainer, ',Role:', userInfo.role);
      
      // Redirect if accessing wrong tab
      if (isTrainer && router.pathname?.includes('/explore')) {
        router.replace('/trainer-schedule');
      } else if (!isTrainer && router.pathname?.includes('/trainer-schedule')) {
        router.replace('/explore');
      }
    }
  }, [userInfo, router.pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
          href: userInfo?.role?.includes('Trainer') ? null : '/explore',
        }}
      />

      <Tabs.Screen
        name="trainer-schedule"
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
          href: userInfo?.role?.includes('Trainer') ? '/trainer-schedule' : null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="people-circle-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}