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
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { fetchDogDocumentTypes } from "../../services/DogDocumentTypeService";
import { addDogDocument } from "../../services/DogDocumentService";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateDogDocumentStyles as styles } from "../../styles/UpdateDogDocumentStyles";

export default function AddDogDocument() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState("");

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setIssueDate(formattedDate);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Document",
      headerShown: true,
    });
    loadDocumentTypes();
  }, []);

  const loadDocumentTypes = async () => {
    try {
      const types = await fetchDogDocumentTypes();
      setDocumentTypes(types);
    } catch (error) {
      console.error("Error loading document types:", error);
      ToastAndroid.show("Failed to load document types", ToastAndroid.SHORT);
    }
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(image);
    }
  };

  const onAddNewDocument = async () => {
    setLoading(true);

    try {
      if (!name || !issueDate || !documentTypeId || !image) {
        ToastAndroid.show("All fields are required!", ToastAndroid.LONG);
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
        imageUrl,
        description: description || "",
        issueDate,
        dogId: id,
        dogDocumentTypeId: documentTypeId,
      };

      console.log("Document data being sent:", newDocument);
      const result = await addDogDocument(newDocument);
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
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={onImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.documentImage} />
            ) : (
              <Image
                source={require("../../assets/images/placeholder.png")}
                style={styles.documentImage}
              />
            )}
            <View style={styles.cameraIconContainer}>
              <MaterialIcons name="camera-alt" size={22} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          <Text style={styles.inputLabel}>Document Name</Text>
          <TextInput
            placeholder="Enter document name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
          <Text style={styles.inputLabel}>
            Issue Date <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.datePickerButton, !issueDate && styles.invalidInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[styles.dateText, !issueDate && styles.placeholderText]}
            >
              {issueDate ? issueDate : "Select Issue Date"}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color="#666" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={issueDate ? new Date(issueDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.inputLabel}>Document Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={documentTypeId}
              onValueChange={setDocumentTypeId}
              style={styles.picker}
            >
              <Picker.Item label="Select Document Type" value="" />
              {documentTypes.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          disabled={loading}
          style={[styles.updateButton, loading && styles.disabledButton]}
          onPress={onAddNewDocument}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>Add Document</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
