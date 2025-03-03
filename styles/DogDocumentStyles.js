import { StyleSheet } from 'react-native';

export const dogDocumentStyles = StyleSheet.create({
    card: {
        padding: 15,
        margin: 10,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 18
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    documentImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    infoContainer: {
        gap: 8
    },
    infoRow: {
        flexDirection: 'row'
    },
    label: {
        width: 120,
        color: '#666',
        fontSize: 14
    },
    value: {
        flex: 1,
        fontSize: 14
    },
    description: {
        marginTop: 5
    },
    descriptionLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 4
    },
    descriptionText: {
        fontSize: 14
    }
});