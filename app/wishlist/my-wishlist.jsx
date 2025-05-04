import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { fetchWishlist, removeFromWishlist } from '../../services/WishlistService';
import { wishlistStyles as styles } from '../../styles/WishlistStyles';

export default function MyWishlist() {
    const navigation = useNavigation();
    const router = useRouter();
    const { userInfo } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'My Wishlist',
            headerShown: true,
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: '600',
                color: '#1a1a1a',
            },
        });
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const response = await fetchWishlist(userInfo.unique_name);
            if (response.success && response.data) {
                const sortedWishlist = response.data.sort((a, b) => 
                    b.id.localeCompare(a.id)
                );
                setWishlist(sortedWishlist);
            } else {
                setWishlist([]);
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (wishlistId) => {
        try {
            Alert.alert(
                'Remove from Wishlist',
                'Are you sure you want to remove this course from your wishlist?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Remove',
                        onPress: async () => {
                            const response = await removeFromWishlist(wishlistId);
                            if (response.success) {
                                loadWishlist();
                            } else {
                                Alert.alert('Error', 'Failed to remove from wishlist');
                            }
                        },
                        style: 'destructive'
                    }
                ]
            );
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            Alert.alert('Error', 'Failed to remove from wishlist');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (wishlist.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="favorite-border" size={80} color="#666" />
                <Text style={styles.emptyTitle}>
                    Your Wishlist is Empty
                </Text>
                <Text style={styles.emptySubtitle}>
                    Start adding your favorite courses to the wishlist
                </Text>
                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => router.push('/explore')}
                >
                    <MaterialIcons name="search" size={24} color="#fff" />
                    <Text style={styles.exploreButtonText}>
                        Explore Courses
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={wishlist}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.wishlistItem}
                        onPress={() => router.push(`/courseDetail/${item.courseId}`)}
                    >
                        <View style={styles.courseInfo}>
                            <Text style={styles.courseName}>{item.courseName}</Text>
                            <View style={styles.courseDetails}>
                                <Text style={styles.customerName}>{item.customerName}</Text>
                                <View style={[
                                    styles.statusBadge, 
                                    item.openClass ? styles.openBadge : styles.closedBadge
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        item.openClass ? styles.openText : styles.closedText
                                    ]}>
                                        {item.openClass ? 'Open' : 'Closed'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoveFromWishlist(item.id)}
                            >
                                <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                            <MaterialIcons name="chevron-right" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onRefresh={loadWishlist}
                refreshing={loading}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}