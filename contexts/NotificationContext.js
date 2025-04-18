import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { userInfo } = useAuth();

    useEffect(() => {
        if (userInfo?.unique_name) {
            loadNotifications();
        } else {
            // Clear notifications when user logs out
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [userInfo]);

    useEffect(() => {
        if (!userInfo?.unique_name) return;

        // Only show notifications where the current user is the recipient
        const userNotifications = notifications
            .filter(n => n.recipientId === userInfo.unique_name)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const count = userNotifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
        saveNotifications();
    }, [notifications, userInfo]);

    const loadNotifications = async () => {
        try {
            if (!userInfo?.unique_name) return;

            // Load all notifications
            const stored = await AsyncStorage.getItem('notifications');
            if (stored) {
                setNotifications(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const saveNotifications = async () => {
        try {
            if (!userInfo?.unique_name) return;

            // Save all notifications in one place
            await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    };

    const addNotification = (notification) => {
        setNotifications(prev => [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            isRead: false,
            senderId: notification.userId, // who sent the notification
            recipientId: notification.recipientId, // who should receive the notification
            ...notification
        }, ...prev]);
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
    };

    const clearAll = () => {
        setNotifications(prev => 
            prev.filter(n => n.recipientId !== userInfo?.unique_name)
        );
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
}