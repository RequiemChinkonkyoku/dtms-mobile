import { View, FlatList, ActivityIndicator, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { fetchLegalDocumentsByCustomerId } from "../../services/LegalDocumentService";
import LegalDocumentCard from "../../components/LegalDocument/LegalDocumentCard";

export default function MyLegalDocuments() {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "My Legal Documents",
      headerShown: true,
    });
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      if (!userInfo) return;
      const response = await fetchLegalDocumentsByCustomerId(
        userInfo.unique_name
      );
      if (response.success && response.objectList) {
        setDocuments(response.objectList);
      }
    } catch (error) {
      console.error("Error fetching legal documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyDocumentList = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50,
        paddingHorizontal: 20,
      }}
    >
      <MaterialIcons name="description" size={60} color="#bdbdbd" />
      <Text
        style={{
          fontSize: 20,
          color: "#666",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        No Legal Documents Found
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <FlatList
        data={documents}
        renderItem={({ item }) => <LegalDocumentCard document={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={EmptyDocumentList}
        refreshing={loading}
        onRefresh={loadDocuments}
      />
    </View>
  );
}
