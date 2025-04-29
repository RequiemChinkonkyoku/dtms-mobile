import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAccountById } from "../../services/AccountService";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotification } from '../../contexts/NotificationContext';
import { styles } from '../../styles/HeaderStyles';

export default function Header({ onRefresh }) {
    const [userName, setUserName] = useState('');
    const { userInfo } = useAuth();
    const router = useRouter();
    const { unreadCount } = useNotification();

    const handleRefresh = async () => {
        if (onRefresh) {
            onRefresh();
        }
        await loadUserProfile();
    };

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (!userInfo) return;
                const userId = userInfo.unique_name;
                const profile = await fetchAccountById(userId);
                if (profile) {
                    setUserName(profile.fullName);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        loadUserProfile();
    }, [userInfo]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.userSection}>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        style={styles.refreshButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="dog" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.userName}>{userName || 'User'}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/notification/notification')}
                    style={styles.notificationButton}
                >
                    <Feather name="bell" size={24} color="#007AFF" />
                    {unreadCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Feather name="search" size={24} color="#007AFF" />
                <TextInput
                    placeholder='Search for courses, trainers...'
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
            </View>
            <View style={styles.bottomSpacing} />
        </View>
    );
}