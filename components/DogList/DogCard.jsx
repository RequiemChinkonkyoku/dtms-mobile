import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function DogCard({ dog }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
      }}
      onPress={() => router.push(`/dogDetail/${dog.id}`)}
    >
      <Image
        source={{ uri: dog.imageUrl }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
        }}
      />

      <View style={{ flex: 1, gap: 7 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 18 }}>{dog.name}</Text>
        <Text style={{ fontFamily: 'outfit', color: 'gray', fontSize: 14 }}>
          Date of Birth: {dog.dateOfBirth}
        </Text>
        <Text style={{ fontFamily: 'outfit', fontSize: 14 }}>
          Gender: {dog.gender === 0 ? 'Male' : 'Female'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
