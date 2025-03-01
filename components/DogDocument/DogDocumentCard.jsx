import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { dogDocumentStyles } from '../../styles/DogDocumentStyles';

export default function DogDocumentCard({ document }) {
  const router = useRouter();

  return (
    <TouchableOpacity style={dogDocumentStyles.card}>
      <View style={dogDocumentStyles.header}>
        <Text style={dogDocumentStyles.title}>{document.name}</Text>
        <View style={[
          dogDocumentStyles.statusBadge,
          { backgroundColor: document.status === 1 ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Text style={[
            dogDocumentStyles.statusText,
            { color: document.status === 1 ? '#2E7D32' : '#C62828' }
          ]}>
            {document.status === 1 ? '● Active' : '● Inactive'}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: document.imageUrl }}
        style={dogDocumentStyles.documentImage}
      />

      <View style={dogDocumentStyles.infoContainer}>
        <View style={dogDocumentStyles.infoRow}>
          <Text style={dogDocumentStyles.label}>Document Type:</Text>
          <Text style={dogDocumentStyles.value}>{document.dogDocumentType.name}</Text>
        </View>

        <View style={dogDocumentStyles.infoRow}>
          <Text style={dogDocumentStyles.label}>Authority:</Text>
          <Text style={dogDocumentStyles.value}>{document.issuingAuthority}</Text>
        </View>

        <View style={dogDocumentStyles.infoRow}>
          <Text style={dogDocumentStyles.label}>Issue Date:</Text>
          <Text style={dogDocumentStyles.value}>
            {new Date(document.issueDate).toLocaleDateString()}
          </Text>
        </View>

        {document.description && (
          <View style={dogDocumentStyles.description}>
            <Text style={dogDocumentStyles.descriptionLabel}>Description:</Text>
            <Text style={dogDocumentStyles.descriptionText}>{document.description}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}