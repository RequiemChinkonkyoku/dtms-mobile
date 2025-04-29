import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconContainer: {
        backgroundColor: '#007AFF',
        padding: 6,
        borderRadius: 10,
        marginRight: 10,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 24,
        color: '#1a1a1a',
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
        paddingLeft: 36,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        fontFamily: 'outfit',
        fontSize: 15,
        flex: 1,
        marginLeft: 8,
        paddingVertical: 4,
    }
});