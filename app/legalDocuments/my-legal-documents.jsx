import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { fetchLegalDocumentsByCustomerId } from "../../services/LegalDocumentService";
import LegalDocumentCard from "../../components/LegalDocument/LegalDocumentCard";
import LegalDocumentPolicyModal from "../../components/LegalDocument/LegalDocumentPolicyModal";

export default function MyLegalDocuments() {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "My Legal Documents",
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsPolicyModalVisible(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f0f2f5',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <MaterialIcons name="info-outline" size={24} color="#1877f2" />
        </TouchableOpacity>
      ),
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
        const sortedDocuments = response.objectList.sort((a, b) =>
          new Date(b.createdTime) - new Date(a.createdTime)
        );
        setDocuments(sortedDocuments);
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

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#1877f2",
          padding: 15,
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => router.push(`/legalDocuments/add-legal-document`)}
      >
        <MaterialIcons
          name="add"
          size={24}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
          Add Document
        </Text>
      </TouchableOpacity>

      <LegalDocumentPolicyModal
        visible={isPolicyModalVisible}
        onClose={() => setIsPolicyModalVisible(false)}
      />
    </View>
  );
}
