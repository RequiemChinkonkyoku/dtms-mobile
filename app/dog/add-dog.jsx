import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AddNewDog } from '../../services/DogService';
import { uploadImageToCloudinary } from '../../services/UploadFileService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "../../contexts/AuthContext";
import { fetchCustomerProfile } from '../../services/ProfileService';
import { fetchDogBreeds } from '../../services/DogBreedService';

export default function AddDog() {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState(null);
    const [dogBreedId, setDogBreedId] = useState('');
    const [dogBreeds, setDogBreeds] = useState([]);
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Add New Dog',
            headerShown: true
        });
        loadDogBreeds();
    }, []);

    const loadDogBreeds = async () => {
        try {
            const breeds = await fetchDogBreeds();
            if (breeds) {
                setDogBreeds(breeds);
            }
        } catch (error) {
            console.error('Error loading dog breeds:', error);
            ToastAndroid.show('Failed to load dog breeds', ToastAndroid.SHORT);
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
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDateOfBirth(formattedDate);
        }
    };

    const onAddNewDog = async () => {
        setLoading(true);

        try {
            if (!name || !dateOfBirth || !dogBreedId || !image || !userInfo) {
                ToastAndroid.show('All fields are required!', ToastAndroid.LONG);
                setLoading(false);
                return;
            }

            if (gender === null) {
                ToastAndroid.show('Gender must be selected!', ToastAndroid.LONG);
                setLoading(false);
                return;
            }

            const imageUrl = await uploadImageToCloudinary(image);
            if (!imageUrl) {
                ToastAndroid.show('Image upload failed!', ToastAndroid.LONG);
                setLoading(false);
                return;
            }

            const customerProfile = await fetchCustomerProfile(userInfo.unique_name);
            if (!customerProfile || !customerProfile.id) {
                ToastAndroid.show('Failed to get customer profile!', ToastAndroid.LONG);
                return;
            }

            const newDog = {
                name,
                imageUrl,
                dateOfBirth,
                gender: parseInt(gender),
                dogBreedId,
                customerProfileId: customerProfile.id
            };

            const result = await AddNewDog(newDog);
            if (result) {
                ToastAndroid.show('Dog Added Successfully!', ToastAndroid.LONG);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error adding dog:', error);
            ToastAndroid.show('Failed to add dog: ' + (error.message || 'Unknown error'), ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 25 }}>Add New Dog</Text>
            <Text>Fill all details to add a new dog</Text>

            <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} />
                ) : (
                    <Image source={require('./../../assets/images/placeholder.png')} style={{ width: 100, height: 100 }} />
                )}
            </TouchableOpacity>

            <View>
                <TextInput placeholder='Dog Name' onChangeText={(v) => setName(v)} style={inputStyle} />

                {/* <TextInput placeholder='Date of Birth (YYYY-MM-DD)' onChangeText={(v) => setDateOfBirth(v)} style={inputStyle} /> */}
                {/* Date Picker Button */}
                <TouchableOpacity style={inputStyle} onPress={() => setShowDatePicker(true)}>
                    <Text>{dateOfBirth ? dateOfBirth : 'Select Date of Birth'}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <View style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    fontSize: 17,
                    backgroundColor: '#fff',
                    marginTop: 10,
                }}>
                    <Picker
                        selectedValue={dogBreedId}
                        onValueChange={(itemValue) => setDogBreedId(itemValue)}
                    >
                        <Picker.Item label="Select Dog Breed" value="" />
                        {dogBreeds.map(breed => (
                            <Picker.Item
                                key={breed.id}
                                label={breed.name}
                                value={breed.id}
                            />
                        ))}
                    </Picker>
                </View>

                {/* <TextInput placeholder='Dog Breed ID' onChangeText={(v) => setDogBreedId(v)} style={inputStyle} /> */}
                {/* <TextInput placeholder='Customer Profile ID' onChangeText={(v) => setCustomerProfileId(v)} style={inputStyle} /> */}

                {/* <TextInput placeholder='Gender (0 for Male, 1 for Female)' keyboardType='numeric' onChangeText={(v) => setGender(parseInt(v))} style={inputStyle} /> */}
                {/* Gender Picker */}
                <View style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    fontSize: 17,
                    backgroundColor: '#fff',
                    marginTop: 10,
                }}>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => {
                            console.log('Selected gender:', itemValue); // Add this for debugging
                            setGender(itemValue);
                        }}
                    >
                        <Picker.Item label="Select Gender" value={null} />
                        <Picker.Item label="Male" value="0" />
                        <Picker.Item label="Female" value="1" />
                    </Picker>
                </View>

            </View>

            <TouchableOpacity
                disabled={loading}
                style={{
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                    backgroundColor: 'blue'
                }}
                onPress={onAddNewDog}
            >
                {loading ? <ActivityIndicator size={'large'} color={'#fff'} /> : <Text style={{ textAlign: 'center', fontFamily: 'outfit-medium', color: '#fff' }}>Add Dog</Text>}
            </TouchableOpacity>
        </View>
    );
}

const inputStyle = {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    backgroundColor: '#fff',
    marginTop: 10,
};
