import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchDogs } from '../../services/DogService';
import DogCard from '../../components/DogList/DogCard';
import { useNavigation } from 'expo-router';

export default function MyDogs() {
  const navigation = useNavigation();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Dogs',
      headerShown: true
    });
    loadDogs();
  }, []);

  const loadDogs = async () => {
    setLoading(true);
    const data = await fetchDogs();
    if (data) {
      setDogs(data);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30 }}>My Dogs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={dogs}
          keyExtractor={(item) => item.id}
          onRefresh={loadDogs}
          refreshing={loading}
          renderItem={({ item }) => <DogCard dog={item} />}
        />
      )}
    </View>
  );
}
