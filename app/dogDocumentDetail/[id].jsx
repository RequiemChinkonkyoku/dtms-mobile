import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getDogDocumentById } from "../../services/DogDocumentService";
import { MaterialIcons } from "@expo/vector-icons";
import { dogDocumentDetailStyles as styles } from "../../styles/DogDocumentDetailStyles";

export default function DogDocumentDetail() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentDetail();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Document Detail",
      headerShown: true,
    });
  }, []);

  const loadDocumentDetail = async () => {
    try {
      const data = await getDogDocumentById(id);
      setDocument(data);
    } catch (error) {
      console.error("Error loading document:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877f2" />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Document not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: document.imageUrl }}
        style={styles.documentImage}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.documentName}>{document.name}</Text>
          <View
            style={[
              styles.statusBadge,
              document.status === 1
                ? styles.statusBadgeActive
                : styles.statusBadgeInactive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                document.status === 1
                  ? styles.statusTextActive
                  : styles.statusTextInactive,
              ]}
            >
              {document.status === 1 ? "● Active" : "● Inactive"}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <InfoItem
            icon="description"
            label="Document Type"
            value={document.dogDocumentType.name}
          />
          <InfoItem
            icon="business"
            label="Issuing Authority"
            value={document.issuingAuthority}
          />
          <InfoItem
            icon="event"
            label="Issue Date"
            value={new Date(document.issueDate).toLocaleDateString()}
          />
          <InfoItem
            icon="schedule"
            label="Upload Time"
            value={new Date(document.uploadTime).toLocaleString()}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dog Information</Text>
          <View style={styles.dogInfoContainer}>
            <InfoItem icon="pets" label="Dog Name" value={document.dog.name} />
            <InfoItem
              icon="cake"
              label="Date of Birth"
              value={document.dog.dateOfBirth}
            />
            <InfoItem
              icon="person"
              label="Owner"
              value={document.dog.ownerName}
            />
          </View>
        </View>

        {document.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{document.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Type Information</Text>
          <Text style={styles.description}>
            {document.dogDocumentType.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon} size={24} color="#666" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  </View>
);
