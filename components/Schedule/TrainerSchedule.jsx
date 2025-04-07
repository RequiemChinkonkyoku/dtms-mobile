import { View, Text, ScrollView, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTrainerSlots } from '../../services/SlotService';
import { fetchClassById } from '../../services/ClassService';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function TrainerSchedule() {
    const router = useRouter();
    const [slots, setSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useAuth();

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

    const renderEmptyState = () => (
        <View style={{
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <MaterialIcons name="event-busy" size={50} color="#666" />
            <Text style={{
                fontSize: 18,
                color: '#666',
                marginTop: 12,
                textAlign: 'center',
                fontWeight: '500'
            }}>
                No Teaching Schedule Yet
            </Text>
            <Text style={{
                color: '#999',
                marginTop: 8,
                textAlign: 'center'
            }}>
                Pull down to refresh when new slots are assigned
            </Text>
        </View>
    );

    const handleClassPress = async (classId) => {
        try {
            console.log('Fetching class:', classId);
            const response = await fetchClassById(classId);
            console.log('Class data received:', response);
            if (response) {
                router.push({
                    pathname: 'schedule/class-details',
                    params: { classData: JSON.stringify(response) }
                });
            } else {
                console.error('Invalid class data received');
            }
        } catch (error) {
            console.error('Error fetching class details:', error);
        }
    };

    const renderSlot = (slot) => (
        <TouchableOpacity
            key={slot.id}
            onPress={() => {
                console.log('Slot pressed:', slot);
                handleClassPress(slot.classId);
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
            }}
        >
            <MaterialIcons name="schedule" size={24} color="#666" />
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </Text>
                {slot.lessonName && (
                    <Text style={{ color: '#666', marginTop: 4 }}>
                        Lesson: {slot.lessonName}
                    </Text>
                )}
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    const renderClassCard = ([classId, classSlots]) => (
        <LinearGradient
            key={classId}
            colors={['#ffffff', '#f8f9fa']}
            style={{
                marginBottom: 16,
                borderRadius: 12,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
            }}>
                <MaterialIcons name="class" size={24} color="#007AFF" />
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#007AFF',
                    marginLeft: 8
                }}>
                    {classSlots[0].className}
                </Text>
            </View>

            {classSlots.map(renderSlot)}
        </LinearGradient>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#f5f5f5' }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            >
                <View style={{ padding: 16 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginBottom: 16,
                        color: '#333'
                    }}>
                        My Teaching Schedule
                    </Text>

                    {Object.keys(slots).length === 0
                        ? renderEmptyState()
                        : Object.entries(slots).map(renderClassCard)
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}