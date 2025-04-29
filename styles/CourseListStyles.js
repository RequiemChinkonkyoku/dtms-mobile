import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 10,
        padding: 15,
    },
    categoryScroll: {
        marginBottom: 20
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    categoryButtonActive: {
        backgroundColor: '#007AFF',
    },
    categoryButtonInactive: {
        backgroundColor: '#E8E8E8',
    },
    categoryText: {
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#FFF',
    },
    categoryTextInactive: {
        color: '#333',
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        paddingHorizontal: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        paddingLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    courseList: {
        paddingHorizontal: 5,
    },
    courseListContent: {
        paddingBottom: 20,
        gap: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    listFooter: {
        height: 425
    }
});