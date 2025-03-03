import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDogDocuments } from "../../services/DogDocumentService";
import DogDocumentCard from "../../components/DogDocument/DogDocumentCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function DogDocumentPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDogDocuments();
  }, []);

  const loadDogDocuments = async () => {
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

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <FlatList
        data={documents}
        renderItem={({ item }) => <DogDocumentCard document={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10 }}
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
        onPress={() => router.push(`/dogDocument/add/${id}`)}
      >
        <MaterialIcons
          name="note_add"
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
