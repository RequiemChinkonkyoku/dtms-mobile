import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getDogDocuments } from '../../services/DogDocumentService';
import DogDocumentCard from '../../components/DogDocument/DogDocumentCard';

export default function DogDocumentPage() {
    const { id } = useLocalSearchParams();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDogDocuments();
    }, []);

    const loadDogDocuments = async () => {
        try {
            const data = await getDogDocuments(id);
            setDocuments(data);
        } catch (error) {
            console.error('Error loading dog documents:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1877f2" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
            <FlatList
                data={documents}
                renderItem={({ item }) => <DogDocumentCard document={item} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
}