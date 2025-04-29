import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blogImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        resizeMode: 'stretch',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333',
    },
    publishDate: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
    },
    content: {
        fontSize: 18,
        marginTop: 15,
        lineHeight: 28,
        color: '#333',
    }
});