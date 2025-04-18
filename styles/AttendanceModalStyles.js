import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%'
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  concludeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12
  },
  overviewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  },
  overviewIcon: {
    marginRight: 4
  },
  scrollContent: {
    marginBottom: 80
  },
  enrollmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  presentBackground: {
    backgroundColor: '#f0fff4'
  },
  dogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  dogName: {
    marginLeft: 8,
    fontSize: 16
  },
  dogNamePresent: {
    color: '#34C759'
  },
  dogNameAbsent: {
    color: '#000'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },
  presentBadge: {
    backgroundColor: '#34C759'
  },
  absentBadge: {
    backgroundColor: '#FF3B30'
  },
  statusText: {
    color: 'white',
    fontSize: 12
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkoutButton: {
    marginLeft: 8,
    backgroundColor: '#FF9500',
    padding: 8,
    borderRadius: 8
  },
  reportButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flex: 1,
    alignItems: 'center'
  },
  confirmButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  buttonTextWhite: {
    color: 'white'
  },
  buttonTextGray: {
    color: '#666'
  }
});