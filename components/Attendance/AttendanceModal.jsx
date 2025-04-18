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
import SlotOverviewModal from './SlotOverviewModal';
import { styles } from '../../styles/AttendanceModalStyles';
import { useNotification } from '../../contexts/NotificationContext';
import { fetchDogById } from '../../services/DogService';

export default function AttendanceModal({ visible, onClose, slot, onRefresh }) {
    const [attendanceData, setAttendanceData] = useState({});
    const [tempAttendanceData, setTempAttendanceData] = useState({});
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [selectedDog, setSelectedDog] = useState(null);
    const [isProgressReportVisible, setIsProgressReportVisible] = useState(false);
    const [selectedProgressReport, setSelectedProgressReport] = useState(null);
    const [attendanceResponse, setAttendanceResponse] = useState(null);
    const [isOverviewVisible, setIsOverviewVisible] = useState(false);
    const { userInfo } = useAuth();

    const isSlotConcluded = () => slot.status === 2;

    const { addNotification } = useNotification();


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

            const response = await getSlotAttendance(slot.slotId);
            setAttendanceResponse(response); // Store the response
            console.log('Full Attendance Response:', JSON.stringify(response, null, 2));

            const attendanceMap = {};
            const attendanceRecords = {};
            const statusMap = {};

            if (response?.success && Array.isArray(response.object)) {
                response.object.forEach(record => {
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

            const dogDetails = await fetchDogById(selectedDog.dogId);

            await submitProgressReport({
                ...reportData,
                attendanceId: attendanceId,
                trainerId: userInfo.unique_name
            });
            await loadData();
            setIsProgressReportVisible(false);


            if (dogDetails && dogDetails.customerProfileId) {
                addNotification({
                    title: 'New Progress Report',
                    message: `A new progress report has been created for ${selectedDog.dogName} in class ${classData.name} on ${format(new Date(slot.slotDate), 'EEEE, MMMM d, yyyy')} at slot ${slot.startTime} - ${slot.endTime}`,
                    userId: userInfo.unique_name, // sender (trainer)
                    recipientId: dogDetails.customerProfileId, // recipient (dog owner)
                });
            }

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
                <View style={styles.modalContainer}>
                    <View style={styles.loadingContainer}>
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.headerTitle}>{classData.name}</Text>
                                <Text style={styles.headerDate}>
                                    {format(new Date(slot.slotDate), 'EEEE, MMMM d, yyyy')}
                                </Text>
                            </View>

                            <View style={styles.headerActions}>
                                {slot.status === 1 && (
                                    <TouchableOpacity
                                        onPress={handleConcludeSlot}
                                        style={styles.concludeButton}
                                    >
                                        <Text style={styles.buttonText}>Conclude</Text>
                                    </TouchableOpacity>
                                )}

                                {slot.status === 2 && (
                                    <TouchableOpacity
                                        onPress={() => setIsOverviewVisible(true)}
                                        style={styles.overviewButton}
                                    >
                                        <MaterialIcons 
                                            name="assessment" 
                                            size={20} 
                                            color="white" 
                                            style={styles.overviewIcon} 
                                        />
                                        <Text style={styles.buttonText}>Overview</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity onPress={onClose}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={styles.scrollContent}>
                            {classData.classEnrollments?.map((enrollment, index) => (
                                <View 
                                    key={`enrollment-${enrollment.id || index}`} 
                                    style={[
                                        styles.enrollmentRow,
                                        attendanceData[enrollment.dogId] && styles.presentBackground
                                    ]}
                                >
                                    <View style={styles.dogInfo}>
                                        <MaterialIcons
                                            name={attendanceData[enrollment.dogId] ? "check-circle" : "pets"}
                                            size={20}
                                            color={attendanceData[enrollment.dogId] ? "#34C759" : "#666"}
                                        />
                                        <Text style={[
                                            styles.dogName,
                                            attendanceData[enrollment.dogId] ? styles.dogNamePresent : styles.dogNameAbsent
                                        ]}>
                                            {enrollment.dogName}
                                        </Text>
                                        {isSlotConcluded() ? (
                                            <View style={[
                                                styles.statusBadge,
                                                attendanceData[enrollment.dogId] ? styles.presentBadge : styles.absentBadge
                                            ]}>
                                                <Text style={styles.statusText}>
                                                    {attendanceData[enrollment.dogId] ? 'Present' : 'Absent'}
                                                </Text>
                                            </View>
                                        ) : attendanceData[enrollment.dogId] && (
                                            <View style={[styles.statusBadge, styles.presentBadge]}>
                                                <Text style={styles.statusText}>Present</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.actionButtons}>
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
                                                                    { text: 'Cancel', style: 'cancel' },
                                                                    {
                                                                        text: 'Checkout',
                                                                        onPress: () => handleCheckout(
                                                                            enrollment.dogId, 
                                                                            attendanceRecords[enrollment.dogId]
                                                                        )
                                                                    }
                                                                ]
                                                            );
                                                        }}
                                                        style={styles.checkoutButton}
                                                    >
                                                        <MaterialIcons name="logout" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                )}

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedDog(enrollment);
                                                        const existingReport = attendanceResponse?.object
                                                            ?.find(record => record.dogId === enrollment.dogId)
                                                            ?.progressReports?.[0];
                                                        setIsProgressReportVisible(true);
                                                        setSelectedProgressReport(existingReport);
                                                    }}
                                                    style={styles.reportButton}
                                                >
                                                    <MaterialIcons
                                                        name={attendanceResponse?.object
                                                            ?.find(record => record.dogId === enrollment.dogId)
                                                            ?.progressReports?.length > 0 ? "visibility" : "rate-review"}
                                                        size={20}
                                                        color="#fff"
                                                    />
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.bottomActions}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={[
                                    styles.cancelButton,
                                    { marginRight: isSlotConcluded() ? 0 : 8 }
                                ]}
                            >
                                <Text style={styles.buttonTextGray}>
                                    {isSlotConcluded() ? 'Close' : 'Cancel'}
                                </Text>
                            </TouchableOpacity>

                            {!isSlotConcluded() && (
                                <TouchableOpacity
                                    onPress={handleConfirmAttendance}
                                    disabled={loading}
                                    style={[
                                        styles.confirmButton,
                                        loading && styles.disabledButton
                                    ]}
                                >
                                    <Text style={styles.buttonTextWhite}>
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
                onClose={() => {
                    setIsProgressReportVisible(false);
                    setSelectedProgressReport(null);
                }}
                onSubmit={handleProgressReport}
                dogName={selectedDog?.dogName}
                loading={loading}
                attendanceId={selectedDog ? attendanceRecords[selectedDog.dogId] : null}
                trainerId={userInfo?.unique_name}
                existingReport={selectedProgressReport}
            />

            <SlotOverviewModal
                visible={isOverviewVisible}
                onClose={() => setIsOverviewVisible(false)}
                slotData={slot}
                classData={classData}
                attendanceData={attendanceData}
                progressReports={attendanceResponse?.object?.flatMap(record => record.progressReports || [])}
            />
        </>
    );
}