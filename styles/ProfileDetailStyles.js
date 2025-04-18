import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5"
  },
  coverSection: {
    height: 180,
    backgroundColor: "#007AFF",
    position: "relative",
    marginBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
    left: windowWidth / 2 - 60,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 100,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  basicInfoSection: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  emailText: {
    fontSize: 16,
    color: "#666"
  },
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusActive: {
    backgroundColor: "#E8F5E9"
  },
  statusInactive: {
    backgroundColor: "#FFEBEE"
  },
  statusText: {
    fontWeight: "600"
  },
  statusTextActive: {
    color: "#2E7D32"
  },
  statusTextInactive: {
    color: "#C62828"
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  contactItemIcon: {
    width: 35
  },
  contactItemContent: {
    flex: 1
  },
  contactLabel: {
    color: "#666",
    fontSize: 14
  },
  contactValue: {
    fontSize: 16,
    color: "#1a1a1a"
  },
  contactList: {
    gap: 20
  },
  pointsSection: {
    backgroundColor: "#f0f7ff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF"
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  tierSection: {
    marginTop: 10
  },
  tierHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333"
  },
  tierCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  tierCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tierName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tierLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
  tierDiscount: {
    fontWeight: 'bold'
  },
  tierDescription: {
    color: "#666",
    marginBottom: 8
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  tierPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  pointsText: {
    color: "#666",
    fontSize: 12
  },
  benefitsInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF9C4",
    borderRadius: 12
  },
  benefitsText: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center'
  }
});