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
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AddNewDog } from "../../services/DogService";
import { uploadImageToCloudinary } from "../../services/UploadFileService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../contexts/AuthContext";
import { fetchDogBreeds } from "../../services/DogBreedService";
import { styles } from '../../styles/AddDogStyles';

export default function AddDog() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(null);
  const [dogBreedId, setDogBreedId] = useState("");
  const [dogBreeds, setDogBreeds] = useState([]);
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Dog",
      headerShown: true,
    });
    loadDogBreeds();
  }, []);

  const loadDogBreeds = async () => {
    try {
      const breeds = await fetchDogBreeds();
      if (breeds) {
        const sortedBreeds = breeds.sort((a, b) => a.name.localeCompare(b.name));
        setDogBreeds(sortedBreeds);
      }
    } catch (error) {
      console.error("Error loading dog breeds:", error);
      ToastAndroid.show("Failed to load dog breeds", ToastAndroid.SHORT);
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
      console.log(image);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDateOfBirth(formattedDate);
    }
  };

  const onAddNewDog = async () => {
    setLoading(true);

    try {
      if (!name || !dateOfBirth || !dogBreedId || !image || !userInfo) {
        ToastAndroid.show("All fields are required!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      if (gender === null) {
        ToastAndroid.show("Gender must be selected!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToCloudinary(image);
      if (!imageUrl) {
        ToastAndroid.show("Image upload failed!", ToastAndroid.LONG);
        setLoading(false);
        return;
      }

      const customerProfile = userInfo.unique_name;
      console.log(customerProfile);
      if (!customerProfile) {
        ToastAndroid.show("Failed to get customer profile!", ToastAndroid.LONG);
        return;
      }

      const newDog = {
        name,
        imageUrl,
        dateOfBirth,
        gender: parseInt(gender),
        dogBreedId,
        customerId: customerProfile,
      };

      const result = await AddNewDog(newDog);
      if (result) {
        ToastAndroid.show("Dog Added Successfully!", ToastAndroid.LONG);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding dog:", error);
      ToastAndroid.show(
        "Failed to add dog: " + (error.message || "Unknown error"),
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Add New Dog</Text>
      <Text>Fill all details to add a new dog</Text>

      <View style={styles.imagePickerContainer}>
        <TouchableOpacity onPress={onImagePick}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.selectedImage}
            />
          ) : (
            <Image
              source={require("./../../assets/images/placeholder.png")}
              style={styles.placeholderImage}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Dog Name"
          onChangeText={(v) => setName(v)}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{dateOfBirth ? dateOfBirth : "Select Date of Birth"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
          />
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dogBreedId}
            onValueChange={(itemValue) => setDogBreedId(itemValue)}
          >
            <Picker.Item label="Select Dog Breed" value="" />
            {dogBreeds.map((breed) => (
              <Picker.Item key={breed.id} label={breed.name} value={breed.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value={null} />
            <Picker.Item label="Male" value="0" />
            <Picker.Item label="Female" value="1" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        disabled={loading}
        style={styles.submitButton}
        onPress={onAddNewDog}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"#fff"} />
        ) : (
          <Text style={styles.submitButtonText}>Add Dog</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
