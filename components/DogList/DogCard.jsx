import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { dogCardStyles } from "../../styles/DogCardStyles";

export default function DogCard({ dog, onRefresh }) {
  const router = useRouter();

  return (
    <View style={dogCardStyles.container}>
      <TouchableOpacity
        style={dogCardStyles.mainContent}
        onPress={() => router.push(`/dogDetail/${dog.id}`)}
      >
        <Image source={{ uri: dog.imageUrl }} style={dogCardStyles.image} />

        <View style={dogCardStyles.details}>
          <Text style={dogCardStyles.name}>{dog.name}</Text>
          <Text style={dogCardStyles.info}>
            Date of Birth: {dog.dateOfBirth}
          </Text>
          <Text style={dogCardStyles.info}>
            Gender: {dog.gender === 0 ? "Male" : "Female"}
          </Text>
          <Text style={dogCardStyles.info}>
            Breed: {dog.dogBreedName}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={dogCardStyles.actions}>
        <TouchableOpacity
          onPress={() =>
            router.push(`/certificate/dog-certificate?id=${dog.id}`)
          }
          style={[dogCardStyles.actionButton, { backgroundColor: "#e8f5e9" }]}
        >
          <MaterialIcons name="verified" size={20} color="#4CAF50" />
          <Text style={{ color: "#4CAF50", fontFamily: "outfit-medium" }}>
            Certificates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/enrolledClasses/${dog.id}`)}
          style={[dogCardStyles.actionButton, { backgroundColor: "#e6f3ff" }]}
        >
          <MaterialIcons name="class" size={20} color="#007AFF" />
          <Text style={{ color: "#007AFF", fontFamily: "outfit-medium" }}>
            Classes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/dog/edit-dog?id=${dog.id}`)}
          style={[dogCardStyles.actionButton, { backgroundColor: "#e3f2fd" }]}
        >
          <MaterialIcons name="edit" size={20} color="#1976d2" />
          <Text style={{ color: "#1976d2", fontFamily: "outfit-medium" }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
