import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Alert, Modal, TextInput } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { fetchPretestsByClass, updatePretestStatus } from '../../services/PretestService';
import { styles } from '../../styles/ClassDetailsStyles';

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
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading class details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderInfoCard = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MaterialIcons name="info" size={24} color="#007AFF" />
                <Text style={styles.cardTitle}>Class Information</Text>
            </View>

            <View style={styles.infoGap}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="pets" size={20} color="#666" />
                    <Text style={styles.infoText}>
                        {classData.enrolledDogCount} Dogs Enrolled
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="calendar-today" size={20} color="#666" />
                    <Text style={styles.infoText}>
                        Starts {formatDate(classData.startingDate)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="person" size={20} color="#666" />
                    <Text style={styles.infoText}>
                        {classData.assignedTrainerCount} Trainer(s) Assigned
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderScheduleCard = () => (
        <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
                <MaterialIcons name="schedule" size={24} color="#007AFF" />
                <Text style={styles.scheduleTitle}>Class Schedule</Text>
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
                style={styles.calendar}
            />

            {selectedDate && (
                <View style={styles.selectedDateView}>
                    <Text style={styles.selectedDateText}>
                        Classes on {formatDate(selectedDate)}
                    </Text>
                    {getSlotsByDate(selectedDate).map((slot) => (
                        <View key={slot.id} style={styles.slotRow}>
                            <View style={styles.slotTimeContainer}>
                                <MaterialIcons name="access-time" size={20} color="#666" />
                                <Text style={styles.slotTimeText}>
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getSlotStatusColor(slot.status) }
                            ]}>
                                <Text style={styles.statusText}>
                                    {getSlotStatusText(slot.status)}
                                </Text>
                            </View>
                        </View>
                    ))}
                    {getSlotsByDate(selectedDate).length === 0 && (
                        <Text style={styles.noClassesText}>
                            No classes scheduled for this date
                        </Text>
                    )}
                </View>
            )}
        </View>
    );

    const renderEnrollmentsCard = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MaterialIcons name="pets" size={24} color="#007AFF" />
                <Text style={styles.cardTitle}>Enrolled Dogs</Text>
            </View>

            {classData.classEnrollments.filter(enrollment => enrollment.status !== 0).length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <MaterialIcons name="sentiment-dissatisfied" size={48} color="#666" />
                    <Text style={styles.emptyStateText}>
                        No dogs enrolled yet
                    </Text>
                </View>
            ) : (
                <View style={styles.enrollmentsList}>
                    {classData.classEnrollments
                        .filter(enrollment => enrollment.status !== 0)
                        .map((enrollment) => (
                            <View key={enrollment.id} style={styles.enrollmentItem}>
                                <View style={styles.enrollmentContent}>
                                    <MaterialIcons name="pets" size={20} color="#666" />
                                    <Text style={styles.dogName}>
                                        {enrollment.dogName}
                                    </Text>
                                </View>
                                {enrollment.isBoarding && (
                                    <View style={styles.boardingBadge}>
                                        <MaterialIcons name="home" size={16} color="#007AFF" />
                                        <Text style={styles.boardingText}>Boarding</Text>
                                    </View>
                                )}
                            </View>
                        ))
                    }
                </View>
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
        <View style={styles.pretestCard}>
            <View style={styles.cardHeader}>
                <MaterialIcons name="assignment" size={24} color="#007AFF" />
                <Text style={styles.cardTitle}>Pretest Exam</Text>
            </View>

            {loadingPretests ? (
                <View style={styles.pretestLoadingContainer}>
                    <Text style={styles.pretestLoadingText}>Loading pretests...</Text>
                </View>
            ) : pretests.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <MaterialIcons name="assignment-late" size={48} color="#666" />
                    <Text style={styles.emptyStateText}>
                        No pretests scheduled yet
                    </Text>
                </View>
            ) : (
                <View>
                    {pretests[0]?.testDate && (
                        <View style={styles.pretestDateContainer}>
                            <MaterialIcons name="event" size={20} color="#666" />
                            <Text style={styles.pretestDateText}>
                                {formatDate(pretests[0].testDate)}
                            </Text>
                        </View>
                    )}
                    {classData.classEnrollments.map((enrollment) => {
                        const dogPretest = pretests.find(p => p.dogId === enrollment.dogId);
                        return (
                            <View key={enrollment.id} style={styles.pretestDogItem}>
                                <View style={styles.pretestDogHeader}>
                                    <View style={styles.pretestDogInfo}>
                                        <MaterialIcons name="pets" size={20} color="#666" />
                                        <View style={styles.pretestDogContent}>
                                            <Text style={styles.pretestDogName}>
                                                {enrollment.dogName}
                                            </Text>
                                            {dogPretest && (
                                                <View style={[
                                                    styles.pretestStatusBadge,
                                                    { backgroundColor: getStatusColor(dogPretest.status) }
                                                ]}>
                                                    <Text style={styles.pretestStatusText}>
                                                        {getStatusText(dogPretest.status)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {dogPretest && dogPretest.status === 0 && (
                                        <View style={styles.pretestActionButtons}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedPretest(dogPretest);
                                                    setTargetStatus(1);
                                                    setNoteModalVisible(true);
                                                }}
                                                style={styles.acceptButton}
                                            >
                                                <MaterialIcons name="check" size={16} color="white" />
                                                <Text style={styles.buttonText}>Accept</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedPretest(dogPretest);
                                                    setTargetStatus(2);
                                                    setNoteModalVisible(true);
                                                }}
                                                style={styles.rejectButton}
                                            >
                                                <MaterialIcons name="close" size={16} color="white" />
                                                <Text style={styles.buttonText}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {dogPretest && dogPretest.note && dogPretest.status !== 0 && (
                                    <View style={[
                                        styles.pretestNoteContainer,
                                        { borderLeftColor: getStatusColor(dogPretest.status) }
                                    ]}>
                                        <View style={styles.pretestNoteHeader}>
                                            <MaterialIcons name="notes" size={16} color="#666" />
                                            <Text style={styles.pretestNoteTitle}>
                                                Trainer's Note
                                            </Text>
                                        </View>
                                        <Text style={styles.pretestNoteText}>
                                            {dogPretest.note}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}

            <Modal
                visible={noteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setNoteModalVisible(false)}
            >
                <View style={styles.noteModal}>
                    <View style={styles.noteModalContent}>
                        <Text style={styles.cardTitle}>
                            {targetStatus === 1 ? 'Accept' : 'Reject'} Pretest
                        </Text>
                        <TextInput
                            style={styles.noteInput}
                            placeholder={targetStatus === 1 ? "Add any comments (optional)" : "Reason for rejection (required)"}
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => {
                                    setNoteModalVisible(false);
                                    setNote('');
                                }}
                                style={[styles.rejectButton, { flex: 1 }]}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleStatusUpdateWithNote}
                                style={[styles.acceptButton, { flex: 1 }]}
                            >
                                <Text style={styles.buttonText}>Confirm</Text>
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
                        Course: {classData.courseName}
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