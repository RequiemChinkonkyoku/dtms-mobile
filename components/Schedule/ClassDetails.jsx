import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { fetchPretestsByClass, updatePretestStatus } from '../../services/PretestService';


export default function ClassDetails({ classData, onClose, onRefresh }) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [pretests, setPretests] = useState([]);
    const [loadingPretests, setLoadingPretests] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [selectedPretest, setSelectedPretest] = useState(null);
    const [note, setNote] = useState('');
    const [targetStatus, setTargetStatus] = useState(null);

    useEffect(() => {
        loadPretests();
    }, [classData]);

    const loadPretests = async () => {
        if (!classData?.id) return;
        setLoadingPretests(true);
        try {
            const data = await fetchPretestsByClass(classData.id);
            setPretests(data.objectList || []);
        } catch (error) {
            console.error('Error loading pretests:', error);
            setPretests([]);
        } finally {
            setLoadingPretests(false);
        }
    };

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

    const handleStatusUpdateWithNote = async () => {
        if (targetStatus === 2 && !note.trim()) {
            Alert.alert('Note Required', 'Please provide a reason for rejection');
            return;
        }

        try {
            await updatePretestStatus(selectedPretest.id, targetStatus, note);
            await loadPretests();
            setNoteModalVisible(false);
            setNote('');
            setSelectedPretest(null);
            Alert.alert('Success', 'Pretest status updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update pretest status');
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
                        <View key={slot.id} style={{
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

            {classData.classEnrollments.filter(enrollment => enrollment.status !== 0).length === 0 ? (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <MaterialIcons name="sentiment-dissatisfied" size={48} color="#666" />
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        No dogs enrolled yet
                    </Text>
                </View>
            ) : (
                classData.classEnrollments.filter(enrollment => enrollment.status !== 0).map((enrollment) => (
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

    const getStatusColor = (status) => {
        switch (status) {
            case -1: return '#8E8E93'; // Cancelled
            case 0: return '#FF9500';  // Pending
            case 1: return '#34C759';  // Accepted
            case 2: return '#FF3B30';  // Rejected
            default: return '#8E8E93';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case -1: return 'Cancelled';
            case 0: return 'Pending';
            case 1: return 'Accepted';
            case 2: return 'Rejected';
            default: return 'Unknown';
        }
    };

    const renderPretestCard = () => (
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
                <MaterialIcons name="assignment" size={24} color="#007AFF" />
                <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 8 }}>Pretest Exam</Text>
            </View>

            {loadingPretests ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#666' }}>Loading pretests...</Text>
                </View>
            ) : pretests.length === 0 ? (
                <View style={{ alignItems: 'center', padding: 20 }}>
                    <MaterialIcons name="assignment-late" size={48} color="#666" />
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        No pretests scheduled yet
                    </Text>
                </View>
            ) : (
                <View>
                    {pretests[0]?.testDate && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <MaterialIcons name="event" size={20} color="#666" />
                            <Text style={{ marginLeft: 8, color: '#333', fontWeight: '500' }}>
                                {formatDate(pretests[0].testDate)}
                            </Text>
                        </View>
                    )}
                    {classData.classEnrollments.map((enrollment) => {
                        const dogPretest = pretests.find(p => p.dogId === enrollment.dogId);
                        return (
                            <View key={enrollment.id} style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 8,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <MaterialIcons name="pets" size={20} color="#666" />
                                        <View style={{ marginLeft: 8, flex: 1 }}>
                                            <Text style={{ color: '#333', fontWeight: '500' }}>
                                                {enrollment.dogName}
                                            </Text>
                                            {dogPretest && (
                                                <View style={{
                                                    backgroundColor: getStatusColor(dogPretest.status),
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 2,
                                                    borderRadius: 12,
                                                    alignSelf: 'flex-start',
                                                    marginTop: 4
                                                }}>
                                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
                                                        {getStatusText(dogPretest.status)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {dogPretest && dogPretest.status === 0 && (
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedPretest(dogPretest);
                                                    setTargetStatus(1);
                                                    setNoteModalVisible(true);
                                                }}
                                                style={{
                                                    backgroundColor: '#34C759',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialIcons name="check" size={16} color="white" />
                                                <Text style={{ color: 'white', marginLeft: 4, fontWeight: '600' }}>Accept</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedPretest(dogPretest);
                                                    setTargetStatus(2);
                                                    setNoteModalVisible(true);
                                                }}
                                                style={{
                                                    backgroundColor: '#FF3B30',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 8,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialIcons name="close" size={16} color="white" />
                                                <Text style={{ color: 'white', marginLeft: 4, fontWeight: '600' }}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {dogPretest && dogPretest.note && dogPretest.status !== 0 && (
                                    <View style={{
                                        backgroundColor: '#f0f0f0',
                                        padding: 10,
                                        borderRadius: 6,
                                        marginTop: 8,
                                        borderLeftWidth: 3,
                                        borderLeftColor: getStatusColor(dogPretest.status)
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <MaterialIcons name="notes" size={16} color="#666" />
                                            <Text style={{ marginLeft: 6, fontSize: 13, color: '#666', fontWeight: '500' }}>
                                                Trainer's Note
                                            </Text>
                                        </View>
                                        <Text style={{ color: '#333', fontSize: 14, lineHeight: 20 }}>
                                            {dogPretest.note}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Note Modal */}
            <Modal
                visible={noteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setNoteModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
                            {targetStatus === 1 ? 'Accept Pretest' : 'Reject Pretest'}
                        </Text>

                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                            {targetStatus === 1 ? 'Add a note (optional)' : 'Please provide a reason for rejection'}
                        </Text>

                        <TextInput
                            multiline
                            numberOfLines={4}
                            value={note}
                            onChangeText={setNote}
                            placeholder={targetStatus === 1 ? "Add your notes here..." : "Reason for rejection..."}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 16,
                                textAlignVertical: 'top',
                                minHeight: 100,
                            }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setNoteModalVisible(false);
                                    setNote('');
                                }}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    backgroundColor: '#f1f1f1',
                                }}
                            >
                                <Text style={{ color: '#666' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleStatusUpdateWithNote}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    backgroundColor: targetStatus === 1 ? '#34C759' : '#FF3B30',
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    {targetStatus === 1 ? 'Accept' : 'Reject'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
                    {renderPretestCard()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}