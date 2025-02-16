import { View, Text, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchDogById } from '../../services/DogService';

export default function DogDetail() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [dog, setDog] = useState(null);
  const [dogName, setDogName] = useState(null);

  useEffect(() => {
    loadDogDetail();
  }, []);

  useEffect(() => {
    if (dogName) {
      navigation.setOptions({
        headerTitle: dogName,
        headerShown: true
      });
    }
  }, [dogName]);

  const loadDogDetail = async () => {
    const dogData = await fetchDogById(id);
    if (dogData) {
      console.log(dogData);
      setDog(dogData);
      setDogName(dogData.name)
    }
  };

  if (!dog) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Image
        source={{ uri: dog.imageUrl }}
        style={{
          width: '100%',
          height: 250,
          borderRadius: 10,
        }}
      />
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15
      }}>
        {dog.name}
      </Text>
      <Text style={{
        fontSize: 14,
        color: 'gray',
        marginTop: 5
      }}>
        Breed: {dog.dogBreedId} | Date of Birth: {dog.dateOfBirth}
      </Text>
      <Text style={{
        fontSize: 16,
        marginTop: 15,
        lineHeight: 24
      }}>
        {dog.description}
      </Text>
    </ScrollView>
  );
}
