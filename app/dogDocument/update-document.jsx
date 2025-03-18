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
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dogDocumentTypeId, setDogDocumentTypeId] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(1); // Default to pending

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Update Document",
      headerShown: true,
    });
    loadDocumentTypes();

    if (document) {
      setName(document.name);
      setDescription(document.description || "");
      setIssuingAuthority(document.issuingAuthority);
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        ToastAndroid.show(
          "Issue date cannot be in the future",
          ToastAndroid.LONG
        );
        return;
      }

      const formattedDate = selectedDate.toISOString().split("T")[0];
      setIssueDate(formattedDate);
    }
  };

  const onUpdateDocument = async () => {
    setLoading(true);
    try {
      if (!name || !issueDate || !dogDocumentTypeId || !issuingAuthority) {
        ToastAndroid.show("Required fields must be filled!", ToastAndroid.LONG);
        return;
      }

      // Additional validation for issue date
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
        issuingAuthority,
        issueDate,
        imageUrl,
        dogDocumentTypeId,
        dogId: dogId,
        status: 1, // Always set status to 1 (pending)
      };

      const result = await updateDogDocument(id, updatedDocument);
      if (result) {
        ToastAndroid.show("Document Updated Successfully!", ToastAndroid.LONG);

        // Use router.replace with refresh parameter like in add-document.jsx
        router.replace(`/dogDocumentDetail/${id}?refresh=${Date.now()}`);
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

          <Text style={styles.inputLabel}>Issuing Authority</Text>
          <TextInput
            placeholder="Enter issuing authority"
            value={issuingAuthority}
            onChangeText={setIssuingAuthority}
            style={styles.input}
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

// Update styles to include contentContainer
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  documentImage: {
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontFamily: "outfit-regular",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "outfit-regular",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    overflow: "hidden",
  },
  pickerLabel: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#666",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
  },
  updateButton: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#a0c4ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#333",
    marginBottom: 6,
    marginTop: 5,
  },
};
