import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { fetchDogDocumentTypes } from "../../../services/DogDocumentTypeService";
import { addDogDocument } from "../../../services/DogDocumentService";
import { uploadImageToCloudinary } from "../../../services/UploadFileService";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDocumentStyles } from '../../../styles/AddDocumentStyles';

export default function AddDogDocumentPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    description: "",
    issuingAuthority: "",
    issueDate: new Date(),
    dogId: id,
    dogDocumentTypeId: "",
  });

  // Add image picker function
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Add submit handler
  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      if (selectedImage) {
        const uploadResult = await uploadImageToCloudinary(selectedImage);
        imageUrl = uploadResult.url;
      }

      const documentData = {
        ...formData,
        imageUrl,
        issueDate: formData.issueDate.toISOString().split("T")[0],
      };

      await addDogDocument(documentData);
      router.back();
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  useEffect(() => {
    loadDocumentTypes();
  }, []);

  const loadDocumentTypes = async () => {
    try {
      const types = await fetchDogDocumentTypes();
      setDocumentTypes(types);
    } catch (error) {
      console.error("Error loading document types:", error);
    }
  };

  return (
    <ScrollView style={addDocumentStyles.container}>
        <Text style={addDocumentStyles.title}>Add Dog Document</Text>

        <View style={addDocumentStyles.formContainer}>
            <View style={addDocumentStyles.inputContainer}>
                <Text style={addDocumentStyles.label}>Document Name</Text>
                <TextInput
                    style={addDocumentStyles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter document name"
                />
            </View>

            <TouchableOpacity style={addDocumentStyles.imagePickerButton} onPress={pickImage}>
                {selectedImage ? (
                    <Image
                        source={{ uri: selectedImage }}
                        style={addDocumentStyles.selectedImage}
                    />
                ) : (
                    <Image
                        source={require("../../../assets/images/placeholder.png")}
                        style={addDocumentStyles.selectedImage}
                    />
                )}
            </TouchableOpacity>

            <View style={addDocumentStyles.inputContainer}>
                <Text style={addDocumentStyles.label}>Description</Text>
                <TextInput
                    style={[addDocumentStyles.input, addDocumentStyles.textArea]}
                    multiline
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Enter description"
                />
            </View>

            <View style={addDocumentStyles.inputContainer}>
                <Text style={addDocumentStyles.label}>Issuing Authority</Text>
                <TextInput
                    style={addDocumentStyles.input}
                    value={formData.issuingAuthority}
                    onChangeText={(text) => setFormData({ ...formData, issuingAuthority: text })}
                    placeholder="Enter issuing authority"
                />
            </View>

            <TouchableOpacity
                style={addDocumentStyles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>Issue Date: {formData.issueDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.issueDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setFormData({ ...formData, issueDate: selectedDate });
                        }
                    }}
                />
            )}

            <View style={addDocumentStyles.pickerContainer}>
                <Text style={[addDocumentStyles.label, { padding: 10 }]}>Document Type</Text>
                <Picker
                    selectedValue={formData.dogDocumentTypeId}
                    onValueChange={(itemValue) =>
                        setFormData({ ...formData, dogDocumentTypeId: itemValue })
                    }
                >
                    <Picker.Item label="Select Document Type" value="" />
                    {documentTypes.map((type) => (
                        <Picker.Item key={type.id} label={type.name} value={type.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity
                style={addDocumentStyles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={addDocumentStyles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
);
}
