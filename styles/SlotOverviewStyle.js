import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    closeButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f8f9fa',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 8,
    },
    scrollView: {
        marginTop: 16,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#1a1a1a',
    },
    dogCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    dogHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dogName: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#1a1a1a',
    },
    reportContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
    },
    reportItem: {
        marginBottom: 12,
    },
    reportLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    reportText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    reportGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    gridItem: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    gridLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    gridText: {
        fontSize: 12,
        color: '#444',
    },
    noReport: {
        color: '#666',
        fontStyle: 'italic',
    },
    absentDogItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    absentDogName: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
});