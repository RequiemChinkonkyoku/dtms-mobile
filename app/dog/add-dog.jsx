import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AddNewDog } from '../../services/DogService';
import { uploadImageToCloudinary } from '../../services/UploadFileService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddDog() {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState(null);
    const [dogBreedId, setDogBreedId] = useState('');
    const [customerProfileId, setCustomerProfileId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Add New Dog',
            headerShown: true
        });
    }, []);

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

        if (!name || !dateOfBirth || !dogBreedId || !image || !customerProfileId) {
            ToastAndroid.show('All fields are required!', ToastAndroid.LONG);
            setLoading(false);
            return;
        }

        const imageUrl = await uploadImageToCloudinary(image);
        if (!imageUrl) {
            ToastAndroid.show('Image upload failed!', ToastAndroid.LONG);
            setLoading(false);
            return;
        }

        const newDog = {
            name,
            imageUrl,
            dateOfBirth,
            gender,
            dogBreedId,
            customerProfileId
        };

        const result = await AddNewDog(newDog);
        if (result) {
            ToastAndroid.show('Dog Added Successfully!', ToastAndroid.LONG);
            navigation.goBack();
        } else {
            ToastAndroid.show('Failed to add dog.', ToastAndroid.LONG);
        }
        setLoading(false);
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

                <TextInput placeholder='Dog Breed ID' onChangeText={(v) => setDogBreedId(v)} style={inputStyle} />
                <TextInput placeholder='Customer Profile ID' onChangeText={(v) => setCustomerProfileId(v)} style={inputStyle} />

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
                        onValueChange={(itemValue) => setGender(itemValue)}
                    >
                        <Picker.Item label="Select Gender" value={null} />
                        <Picker.Item label="Male" value={0} />
                        <Picker.Item label="Female" value={1} />
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
