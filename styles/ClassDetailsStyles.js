import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoGap: {
        gap: 12
    },
    infoText: {
        marginLeft: 8,
        color: '#333'
    },
    calendar: {
        borderRadius: 10,
        marginBottom: 16
    },
    selectedDateTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    slotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    slotTime: {
        marginLeft: 8,
        color: '#666'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600'
    },
    emptyStateContainer: {
        alignItems: 'center',
        padding: 20
    },
    emptyStateText: {
        color: '#666',
        marginTop: 8,
        textAlign: 'center'
    },
    pretestItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8
    },
    pretestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dogInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dogName: {
        color: '#333',
        fontWeight: '500'
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8
    },
    acceptButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rejectButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        marginLeft: 4,
        fontWeight: '600'
    },
    noteModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20
    },
    noteModalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    noteInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
        height: 100,
        textAlignVertical: 'top'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    scheduleTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8
    },
    calendar: {
        borderRadius: 10,
        marginBottom: 16
    },
    selectedDateView: {
        marginTop: 8
    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    slotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    slotTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    slotTimeText: {
        marginLeft: 8,
        color: '#666'
    },
    statusBadge: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600'
    },
    noClassesText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 8
    },
    enrollmentsList: {
        marginTop: 8
    },
    enrollmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    enrollmentContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dogName: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        flex: 1
    },
    boardingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F2FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },
    boardingText: {
        marginLeft: 4,
        color: '#007AFF',
        fontSize: 12,
        fontWeight: '500'
    },
    pretestCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pretestLoadingContainer: {
        padding: 20,
        alignItems: 'center'
    },
    pretestLoadingText: {
        color: '#666'
    },
    pretestDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    pretestDateText: {
        marginLeft: 8,
        color: '#333',
        fontWeight: '500'
    },
    pretestDogItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    pretestDogHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pretestDogInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    pretestDogContent: {
        marginLeft: 8,
        flex: 1
    },
    pretestDogName: {
        color: '#333',
        fontWeight: '500'
    },
    pretestStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 4
    },
    pretestStatusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500'
    },
    pretestActionButtons: {
        flexDirection: 'row',
        gap: 8
    },
    pretestNoteContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 6,
        marginTop: 8,
        borderLeftWidth: 3
    },
    pretestNoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    pretestNoteTitle: {
        marginLeft: 6,
        fontSize: 13,
        color: '#666',
        fontWeight: '500'
    },
    pretestNoteText: {
        color: '#333',
        fontSize: 14,
        lineHeight: 20
    }
});