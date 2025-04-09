import React from 'react';
import {
    View, Text, Modal, ScrollView, TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { styles } from '../../styles/SlotOverviewStyle';

const SlotOverviewModal = ({ visible, onClose, slotData, classData, attendanceData, progressReports }) => {
    const presentDogs = classData?.classEnrollments?.filter(dog => attendanceData[dog.dogId]) || [];
    const absentDogs = classData?.classEnrollments?.filter(dog => !attendanceData[dog.dogId]) || [];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{classData?.name} Overview</Text>
                            <Text style={styles.date}>
                                {slotData && format(new Date(slotData.slotDate), 'EEEE, MMMM d, yyyy')}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Statistics */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{presentDogs.length}</Text>
                            <Text style={styles.statLabel}>Present</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{absentDogs.length}</Text>
                            <Text style={styles.statLabel}>Absent</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {Math.round((presentDogs.length / (presentDogs.length + absentDogs.length)) * 100)}%
                            </Text>
                            <Text style={styles.statLabel}>Attendance</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {/* Present Dogs Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="check-circle" size={20} color="#34C759" />
                                <Text style={styles.sectionTitle}>Present Dogs</Text>
                            </View>
                            {presentDogs.map(dog => {
                                const report = progressReports?.find(r => r.dogId === dog.dogId);
                                return (
                                    <View key={dog.dogId} style={styles.dogCard}>
                                        <View style={styles.dogHeader}>
                                            <MaterialIcons name="pets" size={20} color="#007AFF" />
                                            <Text style={styles.dogName}>{dog.dogName}</Text>
                                        </View>
                                        {report ? (
                                            <View style={styles.reportContainer}>
                                                <View style={styles.reportItem}>
                                                    <Text style={styles.reportLabel}>Overall Feedback</Text>
                                                    <Text style={styles.reportText}>{report.feedback}</Text>
                                                </View>
                                                <View style={styles.reportGrid}>
                                                    <View style={styles.gridItem}>
                                                        <Text style={styles.gridLabel}>Health</Text>
                                                        <Text style={styles.gridText}>{report.healthObservation}</Text>
                                                    </View>
                                                    <View style={styles.gridItem}>
                                                        <Text style={styles.gridLabel}>Behavior</Text>
                                                        <Text style={styles.gridText}>{report.behaviorObservation}</Text>
                                                    </View>
                                                    <View style={styles.gridItem}>
                                                        <Text style={styles.gridLabel}>Performance</Text>
                                                        <Text style={styles.gridText}>{report.performanceObservation}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ) : (
                                            <Text style={styles.noReport}>No progress report available</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* Absent Dogs Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="cancel" size={20} color="#FF3B30" />
                                <Text style={styles.sectionTitle}>Absent Dogs</Text>
                            </View>
                            {absentDogs.map(dog => (
                                <View key={dog.dogId} style={styles.absentDogItem}>
                                    <MaterialIcons name="pets" size={20} color="#666" />
                                    <Text style={styles.absentDogName}>{dog.dogName}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default SlotOverviewModal;