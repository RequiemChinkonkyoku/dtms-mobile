import { SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import TrainerSchedule from '../../components/Schedule/TrainerSchedule';

export default function TrainerSchedulePage() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Teaching Schedule',
            headerShown: true
        });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <TrainerSchedule />
        </SafeAreaView>
    );
}