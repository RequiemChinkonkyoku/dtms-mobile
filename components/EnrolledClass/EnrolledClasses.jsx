import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { fetchDogEnrolledClasses, fetchClassById } from '../../services/ClassService';

export default function EnrolledClasses({ dogId }) {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [expandedClass, setExpandedClass] = useState(null);
    const [classDetails, setClassDetails] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDateSlots, setSelectedDateSlots] = useState([]);

    useEffect(() => {
        loadEnrolledClasses();
    }, [dogId]);

    const loadEnrolledClasses = async () => {
        const classes = await fetchDogEnrolledClasses(dogId);
        const sortedClasses = classes.sort((a, b) => 
            new Date(a.startingDate) - new Date(b.startingDate)
        );
        setEnrolledClasses(sortedClasses);
    };

    const handleClassExpand = async (classId) => {
        if (expandedClass === classId) {
            setExpandedClass(null);
        } else {
            setExpandedClass(classId);
            if (!classDetails[classId]) {
                const details = await fetchClassById(classId);
                setClassDetails(prev => ({ ...prev, [classId]: details }));
            }
        }
    };

    const handleDayPress = (day) => {
        const selectedDate = day.dateString;
        if (selectedDateSlots.length > 0 &&
            new Date(selectedDateSlots[0].slotDate).toISOString().split('T')[0] === selectedDate) {
            // If clicking the same date, clear the selection
            setSelectedDateSlots([]);
        } else {
            // If clicking a different date, show its slots
            const slots = classDetails[selectedClass.id]?.classSlots.filter(
                slot => new Date(slot.slotDate).toISOString().split('T')[0] === selectedDate
            ) || [];
            const sortedSlots = slots.sort((a, b) => {
                const timeA = new Date(`2000-01-01T${a.startTime}`);
                const timeB = new Date(`2000-01-01T${b.startTime}`);
                return timeA - timeB;
            });
            setSelectedDateSlots(sortedSlots);
        }
    };

    const handleShowCalendar = async (classItem) => {
        setSelectedClass(classItem);
        const details = classDetails[classItem.id] || await fetchClassById(classItem.id);
        if (!classDetails[classItem.id]) {
            setClassDetails(prev => ({ ...prev, [classItem.id]: details }));
        }
        const marked = {};

        details.classSlots.forEach(slot => {
            const dateStr = new Date(slot.slotDate).toISOString().split('T')[0];
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

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                        {classDetails[classItem.id]?.classSlots.map((slot, index) => (
                                            <View
                                                key={index}
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
                                                    {new Date(slot.slotDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Text>
                                                <Text style={{ color: '#666', marginTop: 4 }}>
                                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                </Text>
                                            </View>
                                        ))}
                                    </ScrollView>

                                    {classDetails[classItem.id]?.assignedTrainers && (
                                        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                                                Assigned Trainers
                                            </Text>
                                            {classDetails[classItem.id].assignedTrainers.map(trainer => (
                                                <Text key={trainer.id} style={{ color: '#666', marginBottom: 4 }}>
                                                    • {trainer.name}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
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
                onRequestClose={() => {
                    setShowCalendar(false);
                    setSelectedDateSlots([]);
                }}
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
                            onPress={() => {
                                setShowCalendar(false);
                                setSelectedDateSlots([]);
                            }}
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
                        onDayPress={handleDayPress}
                        theme={{
                            selectedDayBackgroundColor: '#007AFF',
                            todayTextColor: '#007AFF',
                            dotColor: '#007AFF',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                        }}
                    />

                    {selectedDateSlots.length > 0 && (
                        <View style={{
                            padding: 16,
                            borderTopWidth: 1,
                            borderTopColor: '#e0e0e0',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                                Class Times for {new Date(selectedDateSlots[0].slotDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Text>
                            {selectedDateSlots.map((slot, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        padding: 12,
                                        borderRadius: 8,
                                        marginBottom: 8
                                    }}
                                >
                                    <MaterialIcons name="access-time" size={20} color="#007AFF" />
                                    <Text style={{ marginLeft: 8, color: '#333', fontSize: 16 }}>
                                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Modal>
        </>
    );
}