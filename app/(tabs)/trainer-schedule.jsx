import { SafeAreaView } from 'react-native';
import React from 'react';
import TrainerSchedule from '../../components/Schedule/TrainerSchedule';

export default function TrainerSchedulePage() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <TrainerSchedule />
        </SafeAreaView>
    );
}