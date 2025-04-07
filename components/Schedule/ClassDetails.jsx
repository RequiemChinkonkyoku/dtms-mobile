import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import React, { useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';


export default function ClassDetails({ classData, onClose, onRefresh }) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } catch (error) {
            console.error('Error refreshing class details:', error);
        } finally {
            setRefreshing(false);
        }
    }, [onRefresh]);

    const getSlotsByDate = (date) => {
        return classData.classSlots
            .filter(slot => slot.slotDate === date)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const markedDates = useMemo(() => {
        if (!classData?.classSlots) return {};

        const dates = {};
        classData.classSlots.forEach(slot => {
            dates[slot.slotDate] = {
                marked: true,
                dotColor: '#007AFF',
                customStyles: {
                    container: {
                        backgroundColor: selectedDate === slot.slotDate ? '#007AFF' : '#E8F2FF'
                    },
                    text: {
                        color: selectedDate === slot.slotDate ? '#fff' : '#007AFF',
                        fontWeight: '500'
                    }
                }
            };
        });
        return dates;
    }, [classData?.classSlots, selectedDate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSlotStatusColor = (status) => {
        switch (status) {
            case 0:
                return '#FF9500'; // NotYet - Orange
            case 1:
                return '#34C759'; // CheckedIn - Green
            case 2:
                return '#8E8E93'; // Concluded - Gray
            default:
                return '#8E8E93';
        }
    };

    const getSlotStatusText = (status) => {
        switch (status) {
            case 0:
                return 'Not Yet';
            case 1:
                return 'Checked In';
            case 2:
                return 'Concluded';
            default:
                return 'Unknown';
        }
    };

    if (!classData) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading class details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderInfoCard = () => (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MaterialIcons name="info" size={24} color="#007AFF" />
                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Class Information</Text>
            </View>

            <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="pets" size={20} color="#666" />
                    <Text style={{ marginLeft: 8, color: '#333' }}>
                        {classData.enrolledDogCount} Dogs Enrolled
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="calendar-today" size={20} color="#666" />
                    <Text style={{ marginLeft: 8, color: '#333' }}>
                        Starts {formatDate(classData.startingDate)}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="person" size={20} color="#666" />
                    <Text style={{ marginLeft: 8, color: '#333' }}>
                        {classData.assignedTrainerCount} Trainer(s) Assigned
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderScheduleCard = () => (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MaterialIcons name="schedule" size={24} color="#007AFF" />
                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Class Schedule</Text>
            </View>

            <Calendar
                markingType={'custom'}
                markedDates={markedDates}
                onDayPress={(day) => {
                    if (selectedDate === day.dateString) {
                        setSelectedDate(null);
                    } else {
                        setSelectedDate(day.dateString);
                    }
                }}
                theme={{
                    calendarBackground: '#fff',
                    textSectionTitleColor: '#666',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#007AFF',
                    dayTextColor: '#333',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#007AFF',
                    monthTextColor: '#007AFF',
                    arrowColor: '#007AFF',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                }}
                style={{
                    borderRadius: 10,
                    marginBottom: selectedDate ? 16 : 0,
                }}
            />

            {selectedDate && (
                <View style={{ marginTop: 8 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: 8
                    }}>
                        Classes on {formatDate(selectedDate)}
                    </Text>
                    {getSlotsByDate(selectedDate).map((slot) => (
                        <View key={`${slot.slotDate}-${slot.startTime}`} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="access-time" size={20} color="#666" />
                                <Text style={{ marginLeft: 8, color: '#666' }}>
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: getSlotStatusColor(slot.status),
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 12,
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 12,
                                    fontWeight: '600'
                                }}>
                                    {getSlotStatusText(slot.status)}
                                </Text>
                            </View>
                        </View>
                    ))}
                    {getSlotsByDate(selectedDate).length === 0 && (
                        <Text style={{ color: '#666', textAlign: 'center', marginTop: 8 }}>
                            No classes scheduled for this date
                        </Text>
                    )}
                </View>
            )}
        </View>
    );

    const renderEnrollmentsCard = () => (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MaterialIcons name="pets" size={24} color="#007AFF" />
                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Enrolled Dogs</Text>
            </View>

            {classData.classEnrollments.length === 0 ? (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <MaterialIcons name="sentiment-dissatisfied" size={48} color="#666" />
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        No dogs enrolled yet
                    </Text>
                </View>
            ) : (
                classData.classEnrollments.map((enrollment) => (
                    <View key={enrollment.id} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee'
                    }}>
                        <MaterialIcons name="pets" size={20} color="#666" />
                        <Text style={{ marginLeft: 8, color: '#333' }}>
                            {enrollment.dogName}
                        </Text>
                    </View>
                ))
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            >
                <LinearGradient
                    colors={['#007AFF', '#0056b3']}
                    style={{
                        padding: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginBottom: 10 }}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 }}>
                        {classData.name}
                    </Text>
                    <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9 }}>
                        {classData.courseName}
                    </Text>
                </LinearGradient>

                <View style={{ padding: 16 }}>
                    {renderInfoCard()}
                    {renderScheduleCard()}
                    {renderEnrollmentsCard()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}