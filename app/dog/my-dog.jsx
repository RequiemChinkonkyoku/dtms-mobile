import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchUserDog } from '../../services/DogService';
import DogCard from '../../components/DogList/DogCard';
import { useNavigation, useFocusEffect } from 'expo-router';
import { useAuth } from "../../contexts/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';

export default function MyDogs() {
  const navigation = useNavigation();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Dogs',
      headerShown: true
    });
    loadDogs();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadDogs();
    }, [])
  );

  const loadDogs = async () => {
    try {
      setLoading(true);
      if (!userInfo) return;
      const data = await fetchUserDog(userInfo.unique_name);
      if (data) {
        const activeDogs = data.filter(dog => dog.status === 1);
        setDogs(activeDogs);
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyDogList = () => (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 50,
      paddingHorizontal: 20,
    }}>
      <MaterialIcons name="pets" size={60} color="#bdbdbd" />
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
        color: '#666',
        marginTop: 20,
        textAlign: 'center'
      }}>
        No Dogs Found
      </Text>
      <Text style={{
        fontFamily: 'outfit',
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
      }}>
        Add your first dog to start managing their training journey
      </Text>
    </View>
  );

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
          renderItem={({ item }) => (
            <DogCard
              dog={item}
              onRefresh={loadDogs}
            />
          )}
          ListEmptyComponent={EmptyDogList}
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      )}
    </View>
  );
}
