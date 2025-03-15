import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { getDogDocuments } from "../../services/DogDocumentService";
import DogDocumentCard from "../../components/DogDocument/DogDocumentCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function DogDocumentPage() {
  const { id, refresh } = useLocalSearchParams();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Dog's Documents",
      headerShown: true,
    });
    loadDogDocuments();
  }, [refresh]); // Add refresh as a dependency to trigger reload

  const loadDogDocuments = async () => {
    setLoading(true);
    try {
      const data = await getDogDocuments(id);
      setDocuments(data);
    } catch (error) {
      console.error("Error loading dog documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1877f2" />
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDogDocuments();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {documents.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>
            No documents available
          </Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={documents}
          renderItem={({ item }) => (
            <DogDocumentCard document={item} onRefresh={loadDogDocuments} />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 10 }}
        />
      )}

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
        onPress={() => router.push(`/dogDocument/add-document?id=${id}`)}
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
    </View>
  );
}
