import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/TrainerScheduleStyles';
import { SlotItem } from './SlotItem';
import TrainingReportModal from '../TrainingReport/TrainingReportModal';
import { useAuth } from '../../contexts/AuthContext';
import { updateClassStatus } from '../../services/ClassService';

export const ClassCard = ({ classId, classSlots, classDetails, isExpanded, onToggle, onSlotPress, formatTime, onRefresh }) => {

    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const { userInfo } = useAuth();

    const enrollments = classDetails?.classEnrollments || [];

    const groupedSlots = classSlots.reduce((acc, slot) => {
        if (!acc[slot.slotDate]) {
            acc[slot.slotDate] = [];
        }
        acc[slot.slotDate].push(slot);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedSlots).sort();
    sortedDates.forEach(date => {
        groupedSlots[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    const allSlotsConcluded = classSlots.every(slot => slot.status === 2);
    console.log("classSlots statuses:", classSlots.map(slot => slot.status));
    console.log("allSlotsConcluded:", allSlotsConcluded);
    console.log("classDetails:", classDetails);
    console.log("enrollments:", enrollments);

    const getClassStatusColor = (status) => {
        switch (status) {
            case 0:
                return '#8E8E93'; // Inactive
            case 1:
                return '#34C759'; // Active
            case 2:
                return '#007AFF'; // Ongoing
            case 3:
                return '#FF9500'; // Closed
            case 4:
                return '#FF3B30'; // Completed
            default:
                return '#8E8E93';
        }
    };

    const getClassStatusText = (status) => {
        switch (status) {
            case 0:
                return 'Inactive';
            case 1:
                return 'Active';
            case 2:
                return 'Ongoing';
            case 3:
                return 'Closed';
            case 4:
                return 'Completed';
            default:
                return 'Unknown';
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const result = await updateClassStatus(classId, newStatus);
            if (result.success) {
                Alert.alert('Success', 'Class status updated successfully');
                onRefresh();
            } else {
                Alert.alert('Error', 'Failed to update class status');
            }
        } catch (error) {
            console.error('Error updating class status:', error);
            Alert.alert('Error', 'Failed to update class status');
        }
    };

    const renderStatusButton = () => {
        if (classDetails?.status === 1) { // Active
            return (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Start Class',
                            'Are you sure you want to start this class?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Yes', onPress: () => handleStatusUpdate(2) }
                            ]
                        );
                    }}
                    style={{
                        backgroundColor: '#007AFF',
                        padding: 8,
                        borderRadius: 8,
                        marginTop: 8
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Start Class</Text>
                </TouchableOpacity>
            );
        } else if (classDetails?.status === 2 && allSlotsConcluded) { // Ongoing and all slots concluded
            return (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Complete Class',
                            'Are you sure you want to mark this class as completed?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Yes', onPress: () => handleStatusUpdate(4) }
                            ]
                        );
                    }}
                    style={{
                        backgroundColor: '#34C759',
                        padding: 8,
                        borderRadius: 8,
                        marginTop: 8
                    }}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Complete Class</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.classCard}
        >
            <TouchableOpacity
                onPress={() => onSlotPress(classId)}
                style={styles.classHeader}
            >
                <View style={styles.headerLeft}>
                    <MaterialIcons name="class" size={24} color="#007AFF" />
                    <View style={styles.classNameContainer}>
                        <Text style={styles.className}>
                            {classSlots[0].className}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getClassStatusColor(classDetails?.status) }
                        ]}>
                            <Text style={styles.statusText}>
                                {getClassStatusText(classDetails?.status)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.headerRight}>
                    <Text style={styles.slotCount}>
                        {classSlots.length} sessions
                    </Text>
                    <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color="#007AFF"
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.expandButton}
                onPress={() => onToggle(classId)}
            >
                <MaterialIcons
                    name={isExpanded ? "expand-less" : "expand-more"}
                    size={24}
                    color="#666"
                />
            </TouchableOpacity>

            {isExpanded && (
                <>
                    {renderStatusButton()}
                    {sortedDates.map(date => (
                        <SlotItem
                            key={date}
                            date={date}
                            slots={groupedSlots[date]}
                            formatTime={formatTime}
                            onRefresh={onRefresh}
                        />
                    ))}

                    {allSlotsConcluded && enrollments.length > 0 && (
                        <View style={styles.reportsSection}>
                            <View style={styles.reportsSectionHeader}>
                                <MaterialIcons name="assignment" size={24} color="#007AFF" />
                                <Text style={styles.reportsSectionTitle}>
                                    Training Reports
                                </Text>
                            </View>
                            {enrollments.map(enrollment => (
                                <TouchableOpacity
                                    key={enrollment.enrollmentId}
                                    style={styles.reportCard}
                                    onPress={() => {
                                        setSelectedEnrollment(enrollment);
                                        setIsReportModalVisible(true);
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#ffffff', '#f8f9fa']}
                                        style={styles.reportCardGradient}
                                    >
                                        <View style={styles.reportCardLeft}>
                                            <View style={styles.dogIconContainer}>
                                                <MaterialIcons name="pets" size={20} color="#fff" />
                                            </View>
                                            <View style={styles.dogInfo}>
                                                <Text style={styles.dogName}>{enrollment.dogName}</Text>
                                                <Text style={styles.viewReportText}>View Training Report</Text>
                                            </View>
                                        </View>
                                        <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </>
            )}

            <TrainingReportModal
                visible={isReportModalVisible}
                onClose={() => setIsReportModalVisible(false)}
                enrollment={selectedEnrollment}
                trainerProfileId={userInfo?.unique_name}
            />
        </LinearGradient>
    );
};