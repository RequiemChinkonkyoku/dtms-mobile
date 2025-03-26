import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { fetchDogEnrolledClasses, fetchClassSlots } from '../../services/ClassService';

export default function EnrolledClasses({ dogId }) {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [expandedClass, setExpandedClass] = useState(null);
    const [classSlots, setClassSlots] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        loadEnrolledClasses();
    }, [dogId]);

    const loadEnrolledClasses = async () => {
        const classes = await fetchDogEnrolledClasses(dogId);
        setEnrolledClasses(classes);
    };

    const handleClassExpand = async (classId) => {
        if (expandedClass === classId) {
            setExpandedClass(null);
        } else {
            setExpandedClass(classId);
            if (!classSlots[classId]) {
                const slots = await fetchClassSlots(classId);
                setClassSlots(prev => ({ ...prev, [classId]: slots }));
            }
        }
    };

    const handleShowCalendar = async (classItem) => {
        setSelectedClass(classItem);
        const slots = classSlots[classItem.id] || await fetchClassSlots(classItem.id);
        const marked = {};

        slots.forEach(slot => {
            const dateStr = new Date(slot.date).toISOString().split('T')[0];
            marked[dateStr] = {
                selected: true,
                marked: true,
                selectedColor: getStatusColor(classItem.status),
                dotColor: 'white',
                customStyles: {
                    container: {
                        borderRadius: 8,
                    },
                    text: {
                        color: 'white',
                        fontWeight: 'bold'
                    }
                }
            };
        });

        setMarkedDates(marked);
        setShowCalendar(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1: return '#34C759'; // Active
            case 2: return '#FF9500'; // Pending
            case 3: return '#FF3B30'; // Completed
            default: return '#8E8E93'; // Unknown
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Active';
            case 2: return 'Pending';
            case 3: return 'Completed';
            default: return 'Unknown';
        }
    };

    return (
        <>
            <ScrollView style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                    Enrolled Classes
                </Text>
                {enrolledClasses.length > 0 ? (
                    enrolledClasses.map((classItem) => (
                        <View
                            key={classItem.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 16,
                                elevation: 2,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handleClassExpand(classItem.id)}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{classItem.name}</Text>
                                    <Text style={{ color: '#666', marginTop: 4 }}>
                                        Starting: {new Date(classItem.startingDate).toLocaleDateString()}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                        <View
                                            style={{
                                                backgroundColor: getStatusColor(classItem.status),
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 12,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: '500' }}>
                                                {getStatusText(classItem.status)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <MaterialIcons
                                    name={expandedClass === classItem.id ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>

                            {expandedClass === classItem.id && (
                                <View style={{ marginTop: 16 }}>
                                    <TouchableOpacity
                                        onPress={() => handleShowCalendar(classItem)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#e6f3ff',
                                            padding: 12,
                                            borderRadius: 8,
                                            marginBottom: 12
                                        }}
                                    >
                                        <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
                                        <Text style={{ marginLeft: 8, color: '#007AFF', fontWeight: '500' }}>
                                            View Schedule Calendar
                                        </Text>
                                    </TouchableOpacity>

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {classSlots[classItem.id]?.map((slot) => (
                                            <View
                                                key={slot.id}
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    marginRight: 12,
                                                    alignItems: 'center',
                                                    minWidth: 100,
                                                }}
                                            >
                                                <MaterialIcons name="event" size={24} color="#007AFF" />
                                                <Text style={{ marginTop: 4, fontWeight: '500' }}>
                                                    {new Date(slot.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Text>
                                                <Text style={{ color: '#666', marginTop: 4 }}>
                                                    {new Date(slot.date).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 32,
                        backgroundColor: 'white',
                        borderRadius: 16,
                        marginTop: 20,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}>
                        <MaterialIcons name="school" size={80} color="#007AFF" />
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#333',
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No Classes Yet
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#666',
                            textAlign: 'center',
                            lineHeight: 24
                        }}>
                            This dog is not enrolled in any classes at the moment.
                            Check available courses to start the training journey!
                        </Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={showCalendar}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCalendar(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0'
                    }}>
                        <TouchableOpacity
                            onPress={() => setShowCalendar(false)}
                            style={{ padding: 8 }}
                        >
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8 }}>
                            {selectedClass?.name} Schedule
                        </Text>
                    </View>

                    <Calendar
                        markedDates={markedDates}
                        markingType={'custom'}
                        theme={{
                            selectedDayBackgroundColor: '#007AFF',
                            todayTextColor: '#007AFF',
                            dotColor: '#007AFF',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                        }}
                    />
                </View>
            </Modal>
        </>
    );
}