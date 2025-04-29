import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: '#f0f8ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    refreshButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 12,
        marginRight: 10,
    },
    userName: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    notificationButton: {
        backgroundColor: '#E8F1FF',
        padding: 8,
        borderRadius: 12,
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    bottomSpacing: {
        height: 10
    }
});