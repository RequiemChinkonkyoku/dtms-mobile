import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/NotificationStyles';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const { notifications, markAsRead, clearAll } = useNotification();
    const { userInfo } = useAuth();
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Notifications',
            headerShown: true,
            headerRight: () => (
                userNotifications.length > 0 && (
                    <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                        <MaterialIcons name="delete-sweep" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                )
            ),
        });
    }, [userNotifications]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setRefreshing(false);
        }
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        if (date.toDateString() === today.toDateString()) {
            return `Today at ${time}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${time}`;
        } else {
            return `${formattedDate} at ${time}`;
        }
    };

    const userNotifications = notifications
        .filter(n => n.recipientId === userInfo?.unique_name)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            onPress={() => markAsRead(item.id)}
            style={[
                styles.notificationItem,
                item.isRead ? styles.notificationRead : styles.notificationUnread
            ]}
        >
            <Text style={[
                styles.title,
                item.isRead ? styles.titleRead : styles.titleUnread
            ]}>
                {item.title}
            </Text>
            <Text style={styles.message}>
                {item.message}
            </Text>
            <Text style={styles.timestamp}>
                {formatDateTime(item.timestamp)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={userNotifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="notifications-none" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No notifications yet
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}