import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { updateDog, fetchDogById } from '../../services/DogService';
import { uploadImageToCloudinary } from '../../services/UploadFileService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { fetchDogBreeds } from '../../services/DogBreedService';

export default function EditDog() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState(null);
    const [dogBreedId, setDogBreedId] = useState('');
    const [dogBreeds, setDogBreeds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Edit Dog',
            headerShown: true
        });
        loadDogBreeds();
        loadDogDetails();
    }, []);

    const loadDogDetails = async () => {
        try {
            const dogData = await fetchDogById(id);
            if (dogData) {
                setName(dogData.name);
                setImage(dogData.imageUrl);
                setDateOfBirth(dogData.dateOfBirth.split('T')[0]);
                setGender(dogData.gender.toString());
                setDogBreedId(dogData.dogBreedId);
            }
        } catch (error) {
            console.error('Error loading dog details:', error);
            ToastAndroid.show('Failed to load dog details', ToastAndroid.SHORT);
        }
    };

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
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDateOfBirth(formattedDate);
        }
    };

    const onUpdateDog = async () => {
        setLoading(true);
        try {
            if (!name || !dateOfBirth || !dogBreedId || !image || gender === null) {
                ToastAndroid.show('All fields are required!', ToastAndroid.LONG);
                return;
            }
            console.log(dateOfBirth);

            let imageUrl = image;
            if (!image.startsWith('http')) {
                imageUrl = await uploadImageToCloudinary(image);
                if (!imageUrl) {
                    ToastAndroid.show('Image upload failed!', ToastAndroid.LONG);
                    return;
                }
            }

            const updatedDog = {
                name,
                imageUrl,
                dateOfBirth,
                gender: parseInt(gender),
                dogBreedId
            };

            const result = await updateDog(id, updatedDog);
            if (result) {
                ToastAndroid.show('Dog Updated Successfully!', ToastAndroid.LONG);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error updating dog:', error);
            ToastAndroid.show('Failed to update dog', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 15 }} />
                ) : (
                    <Image source={require('./../../assets/images/placeholder.png')} style={{ width: 100, height: 100 }} />
                )}
            </TouchableOpacity>

            <View>
                <TextInput 
                    placeholder='Dog Name' 
                    value={name}
                    onChangeText={setName} 
                    style={styles.input} 
                />

                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={dogBreedId}
                        onValueChange={setDogBreedId}
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

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={gender}
                        onValueChange={setGender}
                    >
                        <Picker.Item label="Select Gender" value={null} />
                        <Picker.Item label="Male" value="0" />
                        <Picker.Item label="Female" value="1" />
                    </Picker>
                </View>
            </View>

            <TouchableOpacity
                disabled={loading}
                style={styles.updateButton}
                onPress={onUpdateDog}
            >
                {loading ? 
                    <ActivityIndicator size={'large'} color={'#fff'} /> : 
                    <Text style={styles.buttonText}>Update Dog</Text>
                }
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
        backgroundColor: '#fff',
        marginTop: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 17,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    updateButton: {
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: '#007AFF',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontFamily: 'outfit-medium',
    }
};