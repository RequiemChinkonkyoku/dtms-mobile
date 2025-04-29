import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 25,
    },
    imagePickerContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    placeholderImage: {
        width: 100,
        height: 100,
    },
    formContainer: {
        marginTop: 20,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 17,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 17,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    submitButton: {
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: 'blue',
    },
    submitButtonText: {
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        color: '#fff',
    }
});