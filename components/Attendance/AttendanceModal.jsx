import { View, Text, Modal, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { markAttendance, getSlotAttendance } from '../../services/AttendanceService';
import { fetchClassById } from '../../services/ClassService';

export default function AttendanceModal({ visible, onClose, slot }) {
    const [attendanceData, setAttendanceData] = useState({});
    const [tempAttendanceData, setTempAttendanceData] = useState({});
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && slot) {
            loadData();
        }
    }, [visible, slot]);

    useEffect(() => {
        setTempAttendanceData(attendanceData);
    }, [attendanceData]);

    const loadData = async () => {
        try {
            setLoading(true);
            const classResponse = await fetchClassById(slot.classId);
            setClassData(classResponse);

            const attendanceResponse = await getSlotAttendance(slot.slotId);
            console.log('Slot ID we are looking for:', slot.slotId);
            console.log('Full Attendance Response:', JSON.stringify(attendanceResponse, null, 2));
            
            const attendanceMap = {};
            if (attendanceResponse?.success && Array.isArray(attendanceResponse.object)) {
                attendanceResponse.object.forEach(record => {
                    console.log("Comparing:", {
                        recordSlotId: record.slotId,
                        currentSlotId: slot.slotId,
                        matches: record.slotId === slot.slotId
                    });
                    if (record.slotId === slot.slotId) {
                        attendanceMap[record.dogId] = true;
                    }
                });
            }
            console.log('Final Attendance Map:', attendanceMap);
            setAttendanceData(attendanceMap);
            setTempAttendanceData(attendanceMap);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceToggle = (dogId) => {
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
                        console.log("Marking attendance for dog:", enrollment.dogName);
                        console.log("Attendance data:", {
                            date: format(new Date(slot.slotDate), 'yyyy-MM-dd'),
                            slotId: slot.slotId,
                            dogId: enrollment.dogId
                        });

                        await markAttendance({
                            date: format(new Date(slot.slotDate), 'yyyy-MM-dd'),
                            slotId: slot.slotId,
                            dogId: enrollment.dogId
                        });
                    }
                } catch (error) {
                    console.error(`Error marking attendance for dog ${enrollment.dogName}:`, error);
                    // Continue with next dog even if one fails
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
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ marginBottom: 80 }}>
                        {classData.classEnrollments?.map((enrollment, index) => (
                            <View
                                key={`enrollment-${enrollment.id || index}`}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#eee',
                                    backgroundColor: attendanceData[enrollment.dogId] ? '#f0fff4' : 'white'
                                }}
                            >
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
                                    {attendanceData[enrollment.dogId] && (
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
                                <Switch
                                    value={!!tempAttendanceData[enrollment.dogId]}
                                    onValueChange={() => handleAttendanceToggle(enrollment.dogId)}
                                    disabled={loading || attendanceData[enrollment.dogId]}
                                    thumbColor={attendanceData[enrollment.dogId] ? "#34C759" : "#fff"}
                                    trackColor={{ false: "#767577", true: "#34C759" }}
                                />
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
                                marginRight: 8,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#666' }}>Cancel</Text>
                        </TouchableOpacity>
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
                    </View>
                </View>
            </View>
        </Modal>
    );
}