import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        marginTop: 'auto',
        maxHeight: '90%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    closeButton: {
        padding: 5
    },
    trainerInfo: {
        backgroundColor: '#e8f4fd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    trainerText: {
        marginLeft: 8,
        color: '#007AFF',
        fontSize: 14
    },
    scrollView: {
        marginBottom: 16
    },
    scrollViewWithActions: {
        marginBottom: 80
    },
    inputSection: {
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 100,
        textAlignVertical: 'top'
    },
    viewSection: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
        minHeight: 60
    },
    viewSectionText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 8
    },
    submitButton: {
        backgroundColor: '#007AFF',
        marginLeft: 8
    },
    disabledButton: {
        backgroundColor: '#ccc'
    },
    buttonText: {
        color: 'white'
    },
    cancelButtonText: {
        color: '#666'
    },
    closeOnlyButton: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center'
    },
    closeOnlyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
});