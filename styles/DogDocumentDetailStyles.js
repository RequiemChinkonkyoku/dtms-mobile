import { StyleSheet } from 'react-native';

export const dogDocumentDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    documentImage: {
        width: '100%',
        height: 300,
    },
    contentContainer: {
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20,
    },
    documentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    statusBadgeActive: {
        backgroundColor: '#E8F5E9',
    },
    statusBadgeInactive: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusTextActive: {
        color: '#2E7D32',
    },
    statusTextInactive: {
        color: '#C62828',
    },
    infoSection: {
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        marginTop: 2,
    },
    dogInfoContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    statusBadgeApproved: {
        backgroundColor: '#e6f4ea',
    },
    statusBadgePending: {
        backgroundColor: '#fff4e5',
    },
    statusBadgeRejected: {
        backgroundColor: '#fce8e8',
    },
    statusTextApproved: {
        color: '#34a853',
    },
    statusTextPending: {
        color: '#f9a825',
    },
    statusTextRejected: {
        color: '#ea4335',
    },
});