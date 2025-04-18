import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

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
                    <TouchableOpacity onPress={clearAll} style={{ marginRight: 16 }}>
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
            onPress={() => {
                markAsRead(item.id);
            }}
            style={{
                padding: 16,
                backgroundColor: item.isRead ? 'white' : '#f0f9ff',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
            }}
        >
            <Text style={{
                fontSize: 16,
                color: '#333',
                fontWeight: item.isRead ? 'normal' : 'bold',
                marginBottom: 4
            }}>
                {item.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
                {item.message}
            </Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                {formatDateTime(item.timestamp)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 50
                    }}>
                        <MaterialIcons name="notifications-none" size={60} color="#ccc" />
                        <Text style={{ fontSize: 16, color: '#666', marginTop: 16 }}>
                            No notifications yet
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}