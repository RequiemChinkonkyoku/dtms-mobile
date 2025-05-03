import { StyleSheet } from 'react-native';

export const legalDocumentStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333'
    },
    documentImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500'
    },
    uploadDate: {
        fontSize: 12,
        color: '#666'
    }
});