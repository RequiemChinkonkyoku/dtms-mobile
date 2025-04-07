import { View, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import ClassDetails from '../../components/Schedule/ClassDetails';

export default function ClassDetailsPage() {
    const router = useRouter();
    const { classData } = useLocalSearchParams();
    const parsedClassData = JSON.parse(classData);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ClassDetails 
                classData={parsedClassData}
                onClose={() => router.back()}
            />
        </SafeAreaView>
    );
}