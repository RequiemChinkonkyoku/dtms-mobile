import { View, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import ClassDetails from '../../components/Schedule/ClassDetails';
import { fetchClassById } from '../../services/ClassService';

export default function ClassDetailsPage() {
    const router = useRouter();
    const { classData } = useLocalSearchParams();
    const [currentClassData, setCurrentClassData] = useState(JSON.parse(classData));

    const handleRefresh = async () => {
        try {
            const updatedClass = await fetchClassById(currentClassData.id);
            if (updatedClass) {
                setCurrentClassData(updatedClass);
            }
        } catch (error) {
            console.error('Error refreshing class details:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ClassDetails 
                classData={currentClassData}
                onClose={() => router.back()}
                onRefresh={handleRefresh}
            />
        </SafeAreaView>
    );
}