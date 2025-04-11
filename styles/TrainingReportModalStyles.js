import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '95%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    inputContainer: {
        marginBottom: 15
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    ratingButtonActive: {
        backgroundColor: '#007AFF'
    },
    ratingButtonInactive: {
        backgroundColor: '#f0f0f0'
    },
    ratingTextActive: {
        color: 'white'
    },
    ratingTextInactive: {
        color: 'black'
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        height: 100
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    reportCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef'
    },
    reportDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007AFF'
    },
    reportField: {
        flexDirection: 'row',
        marginBottom: 8,
        flexWrap: 'wrap'
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        width: 150,
        color: '#666'
    },
    fieldValue: {
        fontSize: 14,
        flex: 1,
        color: '#333'
    }
});