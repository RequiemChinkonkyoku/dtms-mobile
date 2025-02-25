import { StyleSheet } from 'react-native';

export const customerProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    infoSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusActive: {
        backgroundColor: '#2ecc71',
    },
    statusInactive: {
        backgroundColor: '#e74c3c',
    },
    membershipContainer: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        marginTop: 10,
        borderRadius: 10,
    },
    pointsContainer: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
    },
    pointsValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    pointsLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    editButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    }
});