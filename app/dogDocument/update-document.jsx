import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  updateDogDocument,
  getDogDocumentTypes,
} from "../../services/DogDocumentService";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function UpdateDocument() {
  const params = useLocalSearchParams();
  const id = params.id;
  const document = params.document ? JSON.parse(params.document) : null;
  const dogId = params.dogId; // Add this line to get dogId from params
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dogDocumentTypeId, setDogDocumentTypeId] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Update Document",
      headerShown: true,
    });
    loadDocumentTypes();
    // Initialize form with document data from params
    if (document) {
      setName(document.name);
      setDescription(document.description || "");
      setIssuingAuthority(document.issuingAuthority);
      setImage(document.imageUrl);
      setIssueDate(document.issueDate.split("T")[0]);
      setDogDocumentTypeId(document.dogDocumentTypeId);
    }
  }, []);

  // Remove loadDocumentDetails function

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
        dogId: dogId, // Use the dogId from params
      };

      const result = await updateDogDocument(id, updatedDocument);
      // In onUpdateDocument function
      if (result) {
        ToastAndroid.show("Document Updated Successfully!", ToastAndroid.LONG);
        const refresh = params.refresh;
        if (typeof refresh === "function") {
          refresh();
        }
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
    <View style={{ padding: 20 }}>
      <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 15 }}
          />
        ) : (
          <Image
            source={require("./../../assets/images/placeholder.png")}
            style={{ width: 100, height: 100 }}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Document Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          placeholder="Issuing Authority"
          value={issuingAuthority}
          onChangeText={setIssuingAuthority}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{issueDate ? issueDate : "Select Issue Date"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={issueDate ? new Date(issueDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dogDocumentTypeId}
            onValueChange={setDogDocumentTypeId}
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
        style={styles.updateButton}
        onPress={onUpdateDocument}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : (
          <Text style={styles.buttonText}>Update Document</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  updateButton: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    backgroundColor: "#007AFF",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
};
