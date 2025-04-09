import { View, Text, ScrollView, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTrainerSlots } from '../../services/SlotService';
import { fetchClassById } from '../../services/ClassService';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/TrainerScheduleStyles';
import { EmptyState } from './EmptyState';
import { ClassCard } from './ClassCard';

export default function TrainerSchedule() {
    const router = useRouter();
    const [slots, setSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useAuth();
    const [expandedClasses, setExpandedClasses] = useState(new Set());

    const loadSlots = async () => {
        if (userInfo?.unique_name) {
            const trainerSlots = await fetchTrainerSlots(userInfo.unique_name);
            const groupedSlots = trainerSlots.reduce((acc, slot) => {
                if (!acc[slot.classId]) {
                    acc[slot.classId] = [];
                }
                acc[slot.classId].push(slot);
                return acc;
            }, {});
            setSlots(groupedSlots);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadSlots();
        setRefreshing(false);
    };

    useEffect(() => {
        loadSlots();
    }, [userInfo]);

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleClassPress = async (classId) => {
        try {
            const response = await fetchClassById(classId);
            if (response) {
                router.push({
                    pathname: 'schedule/class-details',
                    params: { classData: JSON.stringify(response) }
                });
            }
        } catch (error) {
            console.error('Error fetching class details:', error);
        }
    };

    const toggleClass = (classId) => {
        setExpandedClasses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(classId)) {
                newSet.delete(classId);
            } else {
                newSet.add(classId);
            }
            return newSet;
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>
                        My Teaching Schedule
                    </Text>

                    {Object.keys(slots).length === 0
                        ? <EmptyState />
                        : Object.entries(slots).map(([classId, classSlots]) => (
                            <ClassCard
                                key={classId}
                                classId={classId}
                                classSlots={classSlots}
                                isExpanded={expandedClasses.has(classId)}
                                onToggle={toggleClass}
                                onSlotPress={handleClassPress}
                                formatTime={formatTime}
                                onRefresh={onRefresh}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}