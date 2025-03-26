import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteDog } from '../../services/DogService';
import { dogCardStyles } from '../../styles/DogCardStyles';

export default function DogCard({ dog, onRefresh }) {
    const router = useRouter();

    const handleDelete = () => {
        Alert.alert(
            "Delete Dog",
            "Are you sure you want to delete this dog?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        const result = await deleteDog(dog.id);
                        if (result) {
                            onRefresh && onRefresh();
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={dogCardStyles.container}>
            <TouchableOpacity
                style={dogCardStyles.mainContent}
                onPress={() => router.push(`/dogDetail/${dog.id}`)}
            >
                <Image
                    source={{ uri: dog.imageUrl }}
                    style={dogCardStyles.image}
                />

                <View style={dogCardStyles.details}>
                    <Text style={dogCardStyles.name}>{dog.name}</Text>
                    <Text style={dogCardStyles.info}>
                        Date of Birth: {dog.dateOfBirth}
                    </Text>
                    <Text style={dogCardStyles.info}>
                        Gender: {dog.gender === 0 ? 'Male' : 'Female'}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={dogCardStyles.actions}>
                <TouchableOpacity
                    onPress={() => router.push(`/enrolledClasses/${dog.id}`)}
                    style={[dogCardStyles.actionButton, { backgroundColor: '#e6f3ff' }]}
                >
                    <MaterialIcons name="class" size={20} color="#007AFF" />
                    <Text style={{ color: '#007AFF', fontFamily: 'outfit-medium' }}>Classes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push(`/dog/edit-dog?id=${dog.id}`)}
                    style={[dogCardStyles.actionButton, { backgroundColor: '#e3f2fd' }]}
                >
                    <MaterialIcons name="edit" size={20} color="#1976d2" />
                    <Text style={{ color: '#1976d2', fontFamily: 'outfit-medium' }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDelete}
                    style={[dogCardStyles.actionButton, { backgroundColor: '#ffebee' }]}
                >
                    <MaterialIcons name="delete" size={20} color="#d32f2f" />
                    <Text style={{ color: '#d32f2f', fontFamily: 'outfit-medium' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}