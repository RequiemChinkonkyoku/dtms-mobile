import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { fetchDogDocumentTypes } from "../../services/DogDocumentTypeService";
import { addDogDocument } from "../../services/DogDocumentService";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [issuingAuthority, setIssuingAuthority] = useState("");
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
      if (
        !name ||
        !issueDate ||
        !documentTypeId ||
        !image ||
        !issuingAuthority
      ) {
        ToastAndroid.show("All fields are required!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }
      // Just pass the image URI directly
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
        issuingAuthority,
        issueDate,
        dogId: id,
        dogDocumentTypeId: documentTypeId,
      };

      console.log("Document data being sent:", newDocument);
      const result = await addDogDocument(newDocument);
      if (result) {
        ToastAndroid.show("Document Added Successfully!", ToastAndroid.LONG);
        // Navigate back to the dog document page with refresh parameter
        router.replace(`/dogDocument/${id}?refresh=${Date.now()}`);
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 25 }}>Add New Document</Text>
      <Text>Fill all details to add a new document</Text>

      <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 15 }}
          />
        ) : (
          <Image
            source={require("../../assets/images/placeholder.png")}
            style={{ width: 100, height: 100 }}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Document Name"
          onChangeText={setName}
          style={inputStyle}
        />

        <TextInput
          placeholder="Description"
          onChangeText={setDescription}
          style={[inputStyle, { height: 100, textAlignVertical: "top" }]}
          multiline
        />

        <TextInput
          placeholder="Issuing Authority"
          onChangeText={setIssuingAuthority}
          style={inputStyle}
        />

        <TouchableOpacity
          style={inputStyle}
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

        <View style={pickerStyle}>
          <Picker
            selectedValue={documentTypeId}
            onValueChange={setDocumentTypeId}
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
        style={{
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
          backgroundColor: "#1877f2",
        }}
        onPress={onAddNewDocument}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              color: "#fff",
            }}
          >
            Add Document
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
// For the handleDateChange function that's missing:

const inputStyle = {
  padding: 10,
  borderWidth: 1,
  borderRadius: 5,
  fontSize: 17,
  backgroundColor: "#fff",
  marginTop: 10,
};

const pickerStyle = {
  borderWidth: 1,
  borderRadius: 5,
  fontSize: 17,
  backgroundColor: "#fff",
  marginTop: 10,
};
