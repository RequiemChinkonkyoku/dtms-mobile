import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/TrainerScheduleStyles';
import { SlotItem } from './SlotItem';
import TrainingReportModal from '../TrainingReport/TrainingReportModal';
import { useAuth } from '../../contexts/AuthContext';

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
                    <Text style={styles.className}>
                        {classSlots[0].className}
                    </Text>
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
                        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
                                Training Reports
                            </Text>
                            {enrollments.map(enrollment => (
                                <TouchableOpacity
                                    key={enrollment.enrollmentId}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 12,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 8,
                                        marginBottom: 8
                                    }}
                                    onPress={() => {
                                        setSelectedEnrollment(enrollment);
                                        setIsReportModalVisible(true);
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="pets" size={20} color="#666" />
                                        <Text style={{ marginLeft: 8, fontSize: 16 }}>{enrollment.dogName}</Text>
                                    </View>
                                    <MaterialIcons name="assignment" size={24} color="#007AFF" />
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