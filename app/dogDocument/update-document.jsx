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
import React, { useEffect, useState } from "react";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  updateDogDocument,
  getDogDocumentTypes,
} from "../../services/DogDocumentService";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { updateDogDocumentStyles as styles } from "../../styles/UpdateDogDocumentStyles";

export default function UpdateDocument() {
  const params = useLocalSearchParams();
  const id = params.id;
  const document = params.document ? JSON.parse(params.document) : null;
  const dogId = params.dogId;
  const navigation = useNavigation();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dogDocumentTypeId, setDogDocumentTypeId] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(1); // Default to pending

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setIssueDate(formattedDate);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Update Document",
      headerShown: true,
    });
    loadDocumentTypes();

    if (document) {
      setName(document.name);
      setDescription(document.description || "");
      setImage(document.imageUrl);
      setIssueDate(document.issueDate.split("T")[0]);
      setDogDocumentTypeId(document.dogDocumentTypeId);
    }
  }, []);

  const loadDocumentTypes = async () => {
    try {
      const types = await getDogDocumentTypes();
      if (types) {
        setDocumentTypes(types);
      }
    } catch (error) {
      console.error("Error loading document types:", error);
      ToastAndroid.show("Failed to load document types", ToastAndroid.SHORT);
    }
  };

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onUpdateDocument = async () => {
    setLoading(true);
    try {
      if (!name || !issueDate || !dogDocumentTypeId ) {
        ToastAndroid.show("Required fields must be filled!", ToastAndroid.LONG);
        return;
      }

      const selectedDate = new Date(issueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        ToastAndroid.show(
          "Issue date cannot be in the future",
          ToastAndroid.LONG
        );
        setLoading(false);
        return;
      }

      let imageUrl = image;
      if (image && !image.startsWith("http")) {
        imageUrl = await uploadImageToCloudinary(image);
        if (!imageUrl) {
          ToastAndroid.show("Image upload failed!", ToastAndroid.LONG);
          return;
        }
      }

      const updatedDocument = {
        name,
        description,
        issueDate,
        imageUrl,
        dogDocumentTypeId,
        dogId: dogId,
        status: 1,
      };

      const result = await updateDogDocument(id, updatedDocument);
      if (result) {
        ToastAndroid.show("Document Updated Successfully!", ToastAndroid.LONG);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating document:", error);
      ToastAndroid.show("Failed to update document", ToastAndroid.LONG);
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
                source={require("./../../assets/images/placeholder.png")}
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
              selectedValue={dogDocumentTypeId}
              onValueChange={setDogDocumentTypeId}
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
          onPress={onUpdateDocument}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>Update Document</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
