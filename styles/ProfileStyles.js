import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        backgroundColor: '#e6f3ff',
        padding: 8,
        borderRadius: 10,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 20,
        color: '#333',
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 13,
        color: '#666',
        marginTop: 1,
    }
});