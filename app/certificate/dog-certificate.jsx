import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { fetchDogCertificates } from "../../services/CertificateService";
import CertificateCard from "../../components/Certificate/CertificateCard";
import { MaterialIcons } from "@expo/vector-icons";

export default function DogCertificatePage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Dog Certificates",
      headerShown: true,
    });
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const data = await fetchDogCertificates(id);
      setCertificates(data);
    } catch (error) {
      console.error("Error loading certificates:", error);
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
    <View style={{ flex: 1, backgroundColor: "#f0f2f5", padding: 15 }}>
      {certificates.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialIcons name="emoji-events" size={60} color="#bdbdbd" />
          <Text
            style={{
              fontSize: 18,
              color: "#666",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            No certificates available
          </Text>
        </View>
      ) : (
        <FlatList
          data={certificates}
          renderItem={({ item }) => <CertificateCard certificate={item} />}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={loadCertificates}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
