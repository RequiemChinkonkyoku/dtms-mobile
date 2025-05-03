import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    clearButton: {
        marginRight: 16
    },
    notificationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notificationUnread: {
        backgroundColor: '#f0f9ff'
    },
    notificationRead: {
        backgroundColor: 'white'
    },
    title: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4
    },
    titleUnread: {
        fontWeight: 'bold'
    },
    titleRead: {
        fontWeight: 'normal'
    },
    message: {
        fontSize: 14,
        color: '#666'
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16
    }
});