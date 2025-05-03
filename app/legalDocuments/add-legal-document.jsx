import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import { createLegalDocument } from "../../services/LegalDocumentService";
import { addLegalDocumentStyles as styles } from "../../styles/AddLegalDocumentStyles";

export default function AddLegalDocument() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { userInfo } = useAuth();

  const [name, setName] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Legal Document",
      headerShown: true,
    });
  }, []);

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onAddNewDocument = async () => {
    setLoading(true);

    try {
      if (!name || !image) {
        ToastAndroid.show("Name and image are required!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToCloudinary(image);

      if (!imageUrl) {
        ToastAndroid.show("Image upload failed!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const newDocument = {
        name,
        description: "None",
        imageUrl,
        customerProfileId: userInfo.unique_name
      };

      const result = await createLegalDocument(newDocument);
      if (result) {
        ToastAndroid.show("Document Added Successfully!", ToastAndroid.LONG);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding document:", error);
      ToastAndroid.show(
        "Failed to add document: " + (error.message || "Unknown error"),
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.imageSection}>
            <View style={styles.titleContainer}>
              <MaterialIcons name="image" size={24} color="#1877f2" />
              <Text style={styles.sectionTitle}>Document Image</Text>
            </View>
            <TouchableOpacity style={styles.imagePickerContainer} onPress={onImagePick}>
              {image ? (
                <Image source={{ uri: image }} style={styles.documentImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <MaterialIcons name="add-photo-alternate" size={48} color="#1877f2" />
                  <Text style={styles.placeholderText}>Tap to Add Document Image</Text>
                  <Text style={styles.placeholderSubText}>Supported formats: JPG, PNG</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.titleContainer}>
              <MaterialIcons name="description" size={24} color="#1877f2" />
              <Text style={styles.sectionTitle}>Document Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Document Name <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="drive-file-rename-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter document name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={onAddNewDocument}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="cloud-upload" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Upload Document</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}