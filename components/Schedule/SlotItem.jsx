import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/TrainerScheduleStyles';
import { format } from 'date-fns';
import AttendanceModal from '../Attendance/AttendanceModal';
import { useState } from 'react';

export const SlotItem = ({ date, slots, formatTime }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);


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

    const handleSlotPress = (slot) => {
        setSelectedSlot(slot);
        setIsAttendanceModalVisible(true);
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
                        <View style={styles.timeContainer}>
                            <MaterialIcons name="access-time" size={20} color="#007AFF" />
                            <Text style={styles.timeText}>
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </Text>
                        </View>

                        <View style={{
                            backgroundColor: getSlotStatusColor(slot.status),
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            {slot.status === 1 && (
                                <MaterialIcons name="check-circle" size={16} color="white" style={{ marginRight: 4 }} />
                            )}
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                fontWeight: '600'
                            }}>
                                {getSlotStatusText(slot.status, slot.attendanceCount)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <AttendanceModal
                visible={isAttendanceModalVisible}
                onClose={() => setIsAttendanceModalVisible(false)}
                slot={selectedSlot}
            />
        </View>
    );
};