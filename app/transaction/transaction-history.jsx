import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTransactionsByAccountId } from '../../services/TransactionService';
import { transactionStyles } from '../../styles/TransactionStyles';

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { userInfo } = useAuth();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Transaction History',
            headerShown: true,
        });
        loadTransactions();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadTransactions();
        setRefreshing(false);
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await fetchTransactionsByAccountId(userInfo?.unique_name);
            const sortedData = [...(data || [])].sort((a, b) => 
                new Date(b.paymentTime) - new Date(a.paymentTime)
            );
            setTransactions(sortedData);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const renderTransaction = ({ item }) => (
        <View style={transactionStyles.transactionCard}>
            <View style={transactionStyles.statusBar}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={transactionStyles.statusText}>
                    Payment Successful
                </Text>
            </View>

            <View style={transactionStyles.amountSection}>
                <Text style={transactionStyles.amountLabel}>
                    Amount Paid
                </Text>
                <Text style={transactionStyles.amount}>
                    {formatAmount(item.totalAmount)}
                </Text>
            </View>

            <View style={transactionStyles.courseSection}>
                <Text style={transactionStyles.courseName}>
                    {item.courseName}
                </Text>
                <View style={transactionStyles.classRow}>
                    <MaterialIcons name="class" size={18} color="#666" />
                    <Text style={transactionStyles.classText}>
                        {item.className}
                    </Text>
                </View>
            </View>

            <View style={transactionStyles.detailsSection}>
                <View style={transactionStyles.detailRow}>
                    <MaterialIcons name="pets" size={18} color="#666" />
                    <Text style={transactionStyles.detailText}>
                        {item.dogName}
                    </Text>
                </View>

                <View style={transactionStyles.idRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="event" size={18} color="#666" />
                        <Text style={transactionStyles.detailText}>
                            {formatDate(item.paymentTime)}
                        </Text>
                    </View>
                    <Text style={transactionStyles.transactionId}>
                        ID: {item.paymentId}
                    </Text>
                </View>
            </View>
        </View>
    );

    const EmptyTransactionList = () => (
        <View style={transactionStyles.emptyContainer}>
            <MaterialIcons name="account-balance-wallet" size={80} color="#e0e0e0" />
            <Text style={transactionStyles.emptyTitle}>
                No Transactions Yet
            </Text>
            <Text style={transactionStyles.emptyText}>
                Your transaction history will appear here once you make a payment
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={transactionStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={transactionStyles.container}>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingVertical: 16 }}
                ListEmptyComponent={EmptyTransactionList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            />
        </View>
    );
}