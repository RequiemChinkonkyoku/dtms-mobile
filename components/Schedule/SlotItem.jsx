import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/TrainerScheduleStyles';
import { format } from 'date-fns';
import AttendanceModal from '../Attendance/AttendanceModal';
import { useState, useEffect } from 'react';
import { checkinSlot } from '../../services/SlotService';
import { fetchLessonById } from '../../services/LessonService';

export const SlotItem = ({ date, slots, formatTime, onRefresh }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
    const [lessonEquipments, setLessonEquipments] = useState([]);
    const [isEquipmentModalVisible, setIsEquipmentModalVisible] = useState(false);

    useEffect(() => {
        slots.forEach(slot => {
            fetchEquipments(slot);
        });
    }, [slots]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, MMMM d, yyyy');
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

    const fetchEquipments = async (slot) => {
        if (slot.lessonId && !lessonEquipments[slot.lessonId]) {
            try {
                const lessonData = await fetchLessonById(slot.lessonId);
                if (lessonData && lessonData.lessonEquipments) {
                    setLessonEquipments(prev => ({
                        ...prev,
                        [slot.lessonId]: lessonData.lessonEquipments
                    }));
                }
            } catch (error) {
                console.error('Error fetching lesson equipment:', error);
            }
        }
    };

    const handleSlotPress = async (slot) => {
        if (slot.status === 0) {
            Alert.alert(
                'Open Slot',
                'Do you want to open this slot?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Open',
                        onPress: async () => {
                            try {
                                const response = await checkinSlot(slot.slotId);
                                if (response.success) {
                                    Alert.alert(
                                        'Success',
                                        'Slot checked in successfully!',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    onRefresh?.();
                                                    setSelectedSlot({ ...slot, status: 1 });
                                                    setIsAttendanceModalVisible(true);
                                                }
                                            }
                                        ]
                                    );
                                } else {
                                    Alert.alert('Error', response.message || 'Failed to check in slot');
                                }
                            } catch (error) {
                                console.error('Error checking in slot:', error);
                                Alert.alert('Error', error.message || 'Failed to check in slot');
                            }
                        }
                    }
                ]
            );
        } else {
            setSelectedSlot(slot);
            setIsAttendanceModalVisible(true);
        }
    };

    const renderEquipmentModal = () => {
        if (!selectedSlot || !selectedSlot.lessonId || !lessonEquipments[selectedSlot.lessonId]) return null;

        return (
            <Modal
                visible={isEquipmentModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsEquipmentModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsEquipmentModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Required Equipment
                        </Text>
                        {lessonEquipments[selectedSlot.lessonId].map((equipment, index) => (
                            <View
                                key={equipment.id}
                                style={[
                                    styles.equipmentItem,
                                    index === lessonEquipments[selectedSlot.lessonId].length - 1 && { borderBottomWidth: 0 }
                                ]}
                            >
                                <MaterialIcons name="sports-handball" size={24} color="#007AFF" />
                                <View style={styles.equipmentInfo}>
                                    <Text style={styles.equipmentName}>
                                        {equipment.equipmentName}
                                    </Text>
                                    <Text style={styles.equipmentQuantity}>
                                        Quantity: {equipment.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <View style={styles.slotContainer}>
            <View style={styles.dateContainer}>
                <MaterialIcons name="event" size={20} color="#007AFF" />
                <Text style={styles.dateText}>
                    {formatDate(date)}
                </Text>
            </View>

            {slots.map(slot => (
                <TouchableOpacity
                    key={`${slot.slotDate}-${slot.startTime}`}
                    style={styles.slotItemContainer}
                    onPress={() => handleSlotPress(slot)}
                >
                    <View style={styles.slotContent}>
                        <View>
                            <View style={styles.timeContainer}>
                                <MaterialIcons name="access-time" size={20} color="#007AFF" />
                                <Text style={styles.timeText}>
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </Text>
                            </View>
                            {slot.lessonName && (
                                <View style={styles.lessonNameContainer}>
                                    <Text style={styles.lessonNameText}>
                                        Lesson: {slot.lessonName}
                                    </Text>
                                    {slot.lessonId && lessonEquipments[slot.lessonId] && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedSlot(slot);
                                                setIsEquipmentModalVisible(true);
                                            }}
                                            style={styles.equipmentButton}
                                        >
                                            <MaterialIcons name="inventory" size={16} color="#007AFF" />
                                            <Text style={styles.equipmentButtonText}>
                                                View Equipment
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        <View style={[styles.slotStatusContainer, { backgroundColor: getSlotStatusColor(slot.status) }]}>
                            {slot.status === 1 && (
                                <MaterialIcons
                                    name="check-circle"
                                    size={16}
                                    color="white"
                                    style={styles.slotStatusIcon}
                                />
                            )}
                            <Text style={styles.slotStatusText}>
                                {getSlotStatusText(slot.status, slot.attendanceCount)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            {renderEquipmentModal()}

            <AttendanceModal
                visible={isAttendanceModalVisible}
                onClose={() => setIsAttendanceModalVisible(false)}
                slot={selectedSlot}
                onRefresh={onRefresh}
            />
        </View>
    );
};