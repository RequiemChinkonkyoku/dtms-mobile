import { View, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import EnrolledClasses from '../../components/EnrolledClass/EnrolledClasses';

export default function EnrolledClassesScreen() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Enrolled Classes',
            headerShown: true
        });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ flex: 1 }}>
                <EnrolledClasses dogId={id} />
            </View>
        </SafeAreaView>
    );
}