import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    contentContainer: {
        padding: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333'
    },
    emptyStateContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyStateTitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '500'
    },
    emptyStateSubtitle: {
        color: '#999',
        marginTop: 8,
        textAlign: 'center'
    },
    classCard: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    classHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginLeft: 8,
        flex: 1
    },
    slotCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    slotContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    slotItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginLeft: 16,
    },
    expandButton: {
        alignItems: 'center',
        paddingVertical: 4,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
    },
    slotContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        padding: 8,
        borderRadius: 8,
    },
    timeText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
    classInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classNameText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    lessonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    arrowContainer: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
});