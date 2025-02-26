// CourseDetailStyles.js
import { StyleSheet } from 'react-native';

export const courseDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'stretch',
    },
    headerContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    trainer: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    priceContainer: {
        padding: 20,
        backgroundColor: '#f8fff9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0f2e9',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: '#2ecc71',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    priceLabel: {
        fontSize: 18,
        color: '#2ecc71',
        fontWeight: '600',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2ecc71',
        textShadowColor: 'rgba(46, 204, 113, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    detailItem: {
        width: '50%',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginTop: 4,
    },
    // Add new styles for lessons and dog breeds
    lessonContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    lessonDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    lessonDetails: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
    },
    lessonInfo: {
        fontSize: 12,
        color: '#666',
        alignItems: 'center',
    },
    breedContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    breedTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    breedScroll: {
        flexDirection: 'row',
    },
    breedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e1efff',
    },
    breedName: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 4,
        fontWeight: '500',
    },
});
