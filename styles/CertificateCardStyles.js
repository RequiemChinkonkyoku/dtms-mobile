import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginHorizontal: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#2c3e50',
        flex: 1
    },
    description: {
        fontSize: 15,
        color: '#7f8c8d',
        marginBottom: 15,
        lineHeight: 22
    },
    courseContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#1976d2'
    },
    courseName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1976d2',
        marginBottom: 8
    },
    courseDescription: {
        fontSize: 14,
        color: '#5c6b73',
        lineHeight: 20
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        justifyContent: 'flex-end'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusBadgeActive: {
        backgroundColor: '#e8f5e9'
    },
    statusBadgeInactive: {
        backgroundColor: '#ffebee'
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4
    },
    statusTextActive: {
        color: '#2e7d32'
    },
    statusTextInactive: {
        color: '#d32f2f'
    }
});