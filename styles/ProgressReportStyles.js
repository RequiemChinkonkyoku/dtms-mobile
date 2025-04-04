import { StyleSheet } from 'react-native';

export const progressReportStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'outfit-bold',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontFamily: 'outfit',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'outfit-bold',
  },
  sectionContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'outfit',
  },
  trainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerName: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    fontFamily: 'outfit-medium',
  },
  observationItem: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 12,
  },
  observationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'outfit-medium',
  },
  observationContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'outfit',
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
    fontFamily: 'outfit',
  },
  dogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dogName: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
    fontFamily: 'outfit-medium',
  }
});