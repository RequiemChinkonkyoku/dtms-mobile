import { StyleSheet } from 'react-native';

export const transactionStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5'
    },
    transactionCard: {
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#E8F5E9',
        padding: 8,
        borderRadius: 8,
    },
    statusText: {
        marginLeft: 8,
        color: '#4CAF50',
        fontWeight: '500'
    },
    amountSection: {
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    amountLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 0.5
    },
    courseSection: {
        marginBottom: 16
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    classRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    classText: {
        marginLeft: 8,
        color: '#666',
        flex: 1
    },
    detailsSection: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    detailText: {
        marginLeft: 8,
        color: '#666'
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transactionId: {
        color: '#666',
        fontSize: 12
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});