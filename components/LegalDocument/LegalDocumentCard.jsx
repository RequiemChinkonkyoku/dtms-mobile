import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { legalDocumentStyles } from "../../styles/LegalDocumentStyles";

export default function LegalDocumentCard({ document }) {
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return {
          backgroundColor: "#fff3e0",
          textColor: "#f57c00",
          text: "Pending",
        };
      case 1:
        return {
          backgroundColor: "#e8f5e9",
          textColor: "#2e7d32",
          text: "Approved",
        };
      case 2:
        return {
          backgroundColor: "#ffebee",
          textColor: "#d32f2f",
          text: "Rejected",
        };
      default:
        return {
          backgroundColor: "#f5f5f5",
          textColor: "#666666",
          text: "Unknown",
        };
    }
  };

  const statusStyle = getStatusColor(document.status);

  return (
    <View style={legalDocumentStyles.card}>
      <TouchableOpacity
        onPress={() => router.push(`/legalDocumentDetail/${document.id}`)}
      >
        <View style={legalDocumentStyles.headerContainer}>
          <MaterialIcons name="description" size={24} color="#007AFF" />
          <Text style={legalDocumentStyles.title}>{document.name}</Text>
        </View>

        {document.imageUrl && (
          <Image
            source={{ uri: document.imageUrl }}
            style={legalDocumentStyles.documentImage}
            resizeMode="stretch"
          />
        )}

        <View style={legalDocumentStyles.footer}>
          <View
            style={[
              legalDocumentStyles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text
              style={[
                legalDocumentStyles.statusText,
                { color: statusStyle.textColor },
              ]}
            >
              {statusStyle.text}
            </Text>
          </View>

          <Text style={legalDocumentStyles.uploadDate}>
            Uploaded on: {new Date(document.uploadTime).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
