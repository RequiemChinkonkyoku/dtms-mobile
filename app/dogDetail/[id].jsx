import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { fetchDogById } from "../../services/DogService";
import { MaterialIcons } from "@expo/vector-icons";
import { dogDetailsStyles } from "../../styles/DogDetailStyles";
import { deleteDog } from "../../services/DogService";

export default function DogDetail() {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [dog, setDog] = useState(null);
  const [dogName, setDogName] = useState(null);

  useEffect(() => {
    loadDogDetail();
  }, []);

  useEffect(() => {
    if (dogName) {
      navigation.setOptions({
        headerTitle: dogName,
        headerShown: true,
      });
    }
  }, [dogName]);

  const handleDelete = () => {
    Alert.alert("Delete Dog", "Are you sure you want to delete this dog?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const result = await deleteDog(id);
          if (result) {
            router.back();
          }
        },
        style: "destructive",
      },
    ]);
  };

  const loadDogDetail = async () => {
    const dogData = await fetchDogById(id);
    if (dogData) {
      setDog(dogData);
      setDogName(dogData.name);
    }
  };

  if (!dog) {
    return (
      <View style={dogDetailsStyles.loadingContainer}>
        <MaterialIcons name="pets" size={50} color="#666" />
        <Text style={dogDetailsStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={dogDetailsStyles.container}>
      <View style={dogDetailsStyles.imageContainer}>
        <Image
          source={{ uri: dog.imageUrl }}
          style={dogDetailsStyles.image}
          resizeMode="stretch"
        />
      </View>

      <View style={dogDetailsStyles.contentContainer}>
        <View style={dogDetailsStyles.headerSection}>
          <Text style={dogDetailsStyles.name}>{dog.name}</Text>
          <View style={dogDetailsStyles.badgeContainer}>
            <Text style={dogDetailsStyles.badge}>{dog.dogCode}</Text>
          </View>
        </View>

        <View style={dogDetailsStyles.infoSection}>
          <InfoItem icon="cake" label="Birthday" value={dog.dateOfBirth} />

          <InfoItem
            icon="face"
            label="Gender"
            value={dog.gender === 0 ? "Male" : "Female"}
          />

          <InfoItem icon="pets" label="Breed" value={dog.dogBreedName} />
        </View>

        <TouchableOpacity
          style={dogDetailsStyles.documentButton}
          onPress={() =>
            router.push({
              pathname: "/dogDocument/mydog-document",
              params: { id: id, refresh: true },
            })
          }
        >
          <MaterialIcons
            name="description"
            size={24}
            color="#fff"
            style={dogDetailsStyles.documentButtonIcon}
          />
          <Text style={dogDetailsStyles.documentButtonText}>
            View Documents
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dogDetailsStyles.deleteButton}
          onPress={handleDelete}
        >
          <MaterialIcons
            name="delete-outline"
            size={24}
            color="#fff"
            style={dogDetailsStyles.documentButtonIcon}
          />
          <Text style={dogDetailsStyles.documentButtonText}>Delete Dog</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={dogDetailsStyles.infoItem}>
    <MaterialIcons name={icon} size={24} color="#666" />
    <View style={dogDetailsStyles.infoTextContainer}>
      <Text style={dogDetailsStyles.infoLabel}>{label}</Text>
      <Text style={dogDetailsStyles.infoValue}>{value}</Text>
    </View>
  </View>
);
