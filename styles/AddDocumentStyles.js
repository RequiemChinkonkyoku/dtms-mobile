import { StyleSheet } from 'react-native';

export const addDocumentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    formContainer: {
        gap: 15
    },
    imagePickerButton: {
        marginTop: 20,
        alignItems: 'center'
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 15
    },
    inputContainer: {
        marginBottom: 15
    },
    label: {
        marginBottom: 5,
        color: '#666',
        fontSize: 14
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: '#fff'
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff'
    },
    submitButton: {
        backgroundColor: '#1877f2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    }
});