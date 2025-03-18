import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteDogDocument } from "../../services/DogDocumentService";

export default function DogDocumentCard({ document, onRefresh }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push({
      pathname: "/dogDocument/update-document",
      params: {
        id: document.id,
        document: JSON.stringify(document),
        dogId: document.dogId || document.dog.id,
        refresh: () => {
          if (onRefresh) {
            onRefresh();
          }
        },
      },
    });
  };

  if (!document) {
    return null;
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDogDocument(document.id);
              onRefresh && onRefresh();
            } catch (error) {
              Alert.alert("Error", "Failed to delete document");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Add a new handler for card click
  // Update the handleCardClick function to navigate to the correct path
  const handleCardClick = () => {
    router.push({
      pathname: `/dogDocumentDetail/${document.id}`,
      params: {
        document: JSON.stringify(document),
        dogId: document.dogId || document.dog.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainContent} onPress={handleCardClick}>
        <Image
          source={
            document.imageUrl
              ? { uri: document.imageUrl }
              : require("../../assets/images/placeholder.png")
          }
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{document?.name}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    document.status === 0
                      ? "#ffebee"
                      : document.status === 1
                      ? "#fff3e0"
                      : "#e8f5e9",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      document.status === 0
                        ? "#d32f2f"
                        : document.status === 1
                        ? "#f57c00"
                        : "#2e7d32",
                  },
                ]}
              >
                {document.status === 0
                  ? "Rejected"
                  : document.status === 1
                  ? "Pending"
                  : "Approved"}
              </Text>
            </View>
          </View>
          <Text style={styles.info}>
            Type: {document?.dogDocumentType?.name}
          </Text>
          <Text style={styles.info}>
            Issue Date:{" "}
            {document?.issueDate
              ? new Date(document.issueDate).toLocaleDateString()
              : ""}
          </Text>
          <Text style={styles.issuer}>By: {document?.issuingAuthority}</Text>
        </View>
      </TouchableOpacity>

      {(document.status === 0 || document.status === 1) && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.actionButton, { backgroundColor: "#e3f2fd" }]}
          >
            <MaterialIcons name="edit" size={20} color="#1976d2" />
            <Text style={{ color: "#1976d2", fontFamily: "outfit-medium" }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.actionButton, { backgroundColor: "#ffebee" }]}
          >
            <MaterialIcons name="delete" size={20} color="#d32f2f" />
            <Text style={{ color: "#d32f2f", fontFamily: "outfit-medium" }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#333",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    fontFamily: "outfit-regular",
    color: "#666",
    marginBottom: 2,
  },
  issuer: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#1976d2",
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "outfit-medium",
  },
};
