import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { dogDocumentStyles } from "../../styles/DogDocumentStyles";

export default function DogDocumentCard({ document }) {
  const router = useRouter();

  if (!document) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }}
      onPress={() => router.push(`/dogDocumentDetail/${document.id}`)}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {document?.name}
        </Text>
        <Text style={{ color: "#666", marginTop: 5 }}>
          Type: {document?.dogDocumentType?.name}
        </Text>
        <Text style={{ color: "#666", marginTop: 5 }}>
          Issue Date:{" "}
          {document?.issueDate
            ? new Date(document.issueDate).toLocaleDateString()
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
