import { View, Text, Modal, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { markAttendance, getSlotAttendance, checkoutAttendance } from '../../services/AttendanceService';
import { fetchClassById } from '../../services/ClassService';
import ProgressReportModal from '../ProgressReport/ProgressReportModal';
import { submitProgressReport } from '../../services/ProgressReportService';
import { useAuth } from '../../contexts/AuthContext';
import { concludeSlot } from '../../services/SlotService';

export default function AttendanceModal({ visible, onClose, slot, onRefresh }) {
    const [attendanceData, setAttendanceData] = useState({});
    const [tempAttendanceData, setTempAttendanceData] = useState({});
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [selectedDog, setSelectedDog] = useState(null);
    const [isProgressReportVisible, setIsProgressReportVisible] = useState(false);
    const { userInfo } = useAuth();

    const isSlotConcluded = () => slot.status === 2;

    useEffect(() => {
        if (visible && slot) {
            loadData();
        } else {
            setAttendanceData({});
            setTempAttendanceData({});
            setClassData(null);
            setSelectedDog(null);
        }
    }, [visible, slot]);

    const loadData = async () => {
        try {
            setLoading(true);
            const classResponse = await fetchClassById(slot.classId);
            setClassData(classResponse);

            const attendanceResponse = await getSlotAttendance(slot.slotId);
            console.log('Full Attendance Response:', JSON.stringify(attendanceResponse, null, 2));

            const attendanceMap = {};
            const attendanceRecords = {};
            const statusMap = {};

            if (attendanceResponse?.success && Array.isArray(attendanceResponse.object)) {
                attendanceResponse.object.forEach(record => {
                    if (record.slotId === slot.slotId) {
                        attendanceMap[record.dogId] = true;
                        attendanceRecords[record.dogId] = record.id;
                        statusMap[record.dogId] = record.status;
                    }
                });
            }
            setAttendanceData(attendanceMap);
            setTempAttendanceData(attendanceMap);
            setAttendanceRecords(attendanceRecords);
            setAttendanceStatus(statusMap);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceToggle = (dogId) => {
        if (isSlotConcluded()) return;
        setTempAttendanceData(prev => ({
            ...prev,
            [dogId]: !prev[dogId]
        }));
    };

    const handleConfirmAttendance = async () => {
        try {
            setLoading(true);
            for (const enrollment of classData.classEnrollments) {
                try {
                    if (tempAttendanceData[enrollment.dogId]) {
                        await markAttendance({
                            date: format(new Date(slot.slotDate), 'yyyy-MM-dd'),
                            slotId: slot.slotId,
                            dogId: enrollment.dogId
                        });
                    }
                } catch (error) {
                    console.error(`Error marking attendance for dog ${enrollment.dogName}:`, error);
                }
            }
            await loadData();
            onClose();
        } catch (error) {
            console.error('Error in handleConfirmAttendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProgressReport = async (reportData) => {
        try {
            setLoading(true);
            const attendanceId = attendanceRecords[selectedDog.dogId];
            if (!attendanceId) {
                throw new Error('Attendance record not found');
            }
            await submitProgressReport({
                ...reportData,
                attendanceId: attendanceId,
                trainerId: userInfo.unique_name
            });
            await loadData();
            setIsProgressReportVisible(false);
        } catch (error) {
            console.error('Error submitting progress report:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleConcludeSlot = async () => {
        try {
            setLoading(true);
            const response = await concludeSlot(slot.slotId);
            if (response.success) {
                Alert.alert('Success', 'Slot concluded successfully!');
                onRefresh?.();
                onClose();
            } else {
                Alert.alert('Error', 'Failed to conclude slot');
            }
        } catch (error) {
            console.error('Error concluding slot:', error);
            Alert.alert('Error', 'Failed to conclude slot');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (dogId, attendanceId) => {
        try {
            setLoading(true);
            const response = await checkoutAttendance(attendanceId);
            if (response.success) {
                await loadData(); // Refresh the attendance data
                Alert.alert('Success', 'Dog checked out successfully!');
            } else {
                Alert.alert('Error', 'Failed to check out dog');
            }
        } catch (error) {
            console.error('Error checking out dog:', error);
            Alert.alert('Error', 'Failed to check out dog');
        } finally {
            setLoading(false);
        }
    };

    if (!classData) {
        return (
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200
                    }}>
                        <Text>Loading attendance data...</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 16,
                        maxHeight: '80%'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                    {classData.name}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                                    {format(new Date(slot.slotDate), 'EEEE, MMMM d, yyyy')}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {slot.status === 1 && (
                                    <TouchableOpacity
                                        onPress={handleConcludeSlot}
                                        style={{
                                            backgroundColor: '#FF3B30',
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 8,
                                            marginRight: 12
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: '600' }}>Conclude</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={onClose}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ marginBottom: 80 }}>
                            {classData.classEnrollments?.map((enrollment, index) => (
                                <View key={`enrollment-${enrollment.id || index}`} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#eee',
                                    backgroundColor: attendanceData[enrollment.dogId] ? '#f0fff4' : 'white'
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <MaterialIcons
                                            name={attendanceData[enrollment.dogId] ? "check-circle" : "pets"}
                                            size={20}
                                            color={attendanceData[enrollment.dogId] ? "#34C759" : "#666"}
                                        />
                                        <Text style={{
                                            marginLeft: 8,
                                            fontSize: 16,
                                            color: attendanceData[enrollment.dogId] ? '#34C759' : '#000'
                                        }}>
                                            {enrollment.dogName}
                                        </Text>
                                        {isSlotConcluded() ? (
                                            <View style={{
                                                backgroundColor: attendanceData[enrollment.dogId] ? '#34C759' : '#FF3B30',
                                                paddingHorizontal: 8,
                                                paddingVertical: 2,
                                                borderRadius: 12,
                                                marginLeft: 8
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 12 }}>
                                                    {attendanceData[enrollment.dogId] ? 'Present' : 'Absent'}
                                                </Text>
                                            </View>
                                        ) : attendanceData[enrollment.dogId] && (
                                            <View style={{
                                                backgroundColor: '#34C759',
                                                paddingHorizontal: 8,
                                                paddingVertical: 2,
                                                borderRadius: 12,
                                                marginLeft: 8
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 12 }}>Present</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Switch
                                            value={!!tempAttendanceData[enrollment.dogId]}
                                            onValueChange={() => handleAttendanceToggle(enrollment.dogId)}
                                            disabled={loading || attendanceData[enrollment.dogId] || isSlotConcluded()}
                                            thumbColor={attendanceData[enrollment.dogId] ? "#34C759" : "#fff"}
                                            trackColor={{ false: "#767577", true: "#34C759" }}
                                        />
                                        {attendanceData[enrollment.dogId] && (
                                            <>
                                                {attendanceStatus[enrollment.dogId] === 1 && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            Alert.alert(
                                                                'Checkout Dog',
                                                                `Are you sure you want to check out ${enrollment.dogName}?`,
                                                                [
                                                                    {
                                                                        text: 'Cancel',
                                                                        style: 'cancel'
                                                                    },
                                                                    {
                                                                        text: 'Checkout',
                                                                        onPress: () => handleCheckout(enrollment.dogId, attendanceRecords[enrollment.dogId])
                                                                    }
                                                                ]
                                                            );
                                                        }}
                                                        style={{
                                                            marginLeft: 8,
                                                            backgroundColor: '#FF9500',
                                                            padding: 8,
                                                            borderRadius: 8,
                                                        }}
                                                    >
                                                        <MaterialIcons name="logout" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                )}
                                                
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedDog(enrollment);
                                                        setIsProgressReportVisible(true);
                                                    }}
                                                    style={{
                                                        marginLeft: 8,
                                                        backgroundColor: '#007AFF',
                                                        padding: 8,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    <MaterialIcons name="rate-review" size={20} color="#fff" />
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: 16,
                            backgroundColor: 'white',
                            borderTopWidth: 1,
                            borderTopColor: '#eee',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    padding: 12,
                                    borderRadius: 8,
                                    backgroundColor: '#f5f5f5',
                                    flex: 1,
                                    marginRight: isSlotConcluded() ? 0 : 8,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#666' }}>
                                    {isSlotConcluded() ? 'Close' : 'Cancel'}
                                </Text>
                            </TouchableOpacity>

                            {!isSlotConcluded() && (
                                <TouchableOpacity
                                    onPress={handleConfirmAttendance}
                                    disabled={loading}
                                    style={{
                                        padding: 12,
                                        borderRadius: 8,
                                        backgroundColor: loading ? '#ccc' : '#007AFF',
                                        flex: 1,
                                        marginLeft: 8,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ color: 'white' }}>
                                        {loading ? 'Saving...' : 'Confirm'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            <ProgressReportModal
                visible={isProgressReportVisible}
                onClose={() => setIsProgressReportVisible(false)}
                onSubmit={handleProgressReport}
                dogName={selectedDog?.dogName}
                loading={loading}
                attendanceId={selectedDog ? attendanceRecords[selectedDog.dogId] : null}
                trainerId={userInfo?.unique_name}
            />
        </>
    );
}