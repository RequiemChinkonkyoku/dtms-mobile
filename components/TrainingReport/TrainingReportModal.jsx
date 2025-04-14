import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createTrainingReport, fetchTrainingReportsByEnrollmentId } from '../../services/TrainingReportService';
import { styles } from '../../styles/TrainingReportModalStyles';

const TrainingReportModal = ({ visible, onClose, enrollment, trainerProfileId }) => {
    const [report, setReport] = useState({
        behaviorType: '',
        intensity: 5,
        reactionToCommands: 5,
        socialization: 5,
        stressLevel: 5,
        notes: '',
        isPassed: false,
        enrollmentId: enrollment?.enrollmentId,
        trainerProfileId: trainerProfileId
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [existingReports, setExistingReports] = useState([]);
    const [viewMode, setViewMode] = useState(false);

    useEffect(() => {
        if (visible && enrollment?.enrollmentId) {
            loadExistingReports();
        }

    }, [visible, enrollment]);

    const loadExistingReports = async () => {
        setIsLoading(true);
        try {
            const response = await fetchTrainingReportsByEnrollmentId(enrollment.enrollmentId);
            if (response.success && response.objectList.length > 0) {
                setExistingReports(response.objectList);
                setViewMode(true);
            } else {
                setViewMode(false);
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            Alert.alert('Error', 'Failed to load existing reports');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setReport({
            behaviorType: '',
            intensity: 5,
            reactionToCommands: 5,
            socialization: 5,
            stressLevel: 5,
            notes: '',
            enrollmentId: enrollment?.enrollmentId,
            trainerProfileId: trainerProfileId
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await createTrainingReport(report);
            if (response.success) {
                Alert.alert('Success', 'Training report submitted successfully');
                resetForm();
                onClose();
            } else {
                Alert.alert('Error', response.error || 'Failed to submit training report');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit training report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {viewMode ? 'Training Report History' : 'New Training Report'} for {enrollment?.dogName}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : viewMode ? (
                        <ScrollView>
                            {existingReports.map((report, index) => (
                                <View key={report.id} style={styles.reportCard}>
                                    <Text style={styles.reportDate}>
                                        {new Date(report.createdTime).toLocaleDateString("vi-VN")}
                                    </Text>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Behavior Type:</Text>
                                        <Text style={styles.fieldValue}>{report.behaviorType}</Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Intensity:</Text>
                                        <Text style={styles.fieldValue}>{report.intensity}/10</Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Reaction to Commands:</Text>
                                        <Text style={styles.fieldValue}>{report.reactionToCommands}/10</Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Socialization:</Text>
                                        <Text style={styles.fieldValue}>{report.socialization}/10</Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Stress Level:</Text>
                                        <Text style={styles.fieldValue}>{report.stressLevel}/10</Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Training Result:</Text>
                                        <Text style={[
                                            styles.fieldValue,
                                            { color: report.isPassed ? '#34C759' : '#FF3B30' }
                                        ]}>
                                            {report.isPassed ? 'Passed' : 'Not Passed'}
                                        </Text>
                                    </View>
                                    <View style={styles.reportField}>
                                        <Text style={styles.fieldLabel}>Notes:</Text>
                                        <Text style={styles.fieldValue}>{report.notes}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <ScrollView>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Behavior Type</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={report.behaviorType}
                                    onChangeText={(text) => setReport(prev => ({ ...prev, behaviorType: text }))}
                                    placeholder="Enter behavior type"
                                />
                            </View>

                            {[
                                { label: 'Intensity', key: 'intensity' },
                                { label: 'Reaction to Commands', key: 'reactionToCommands' },
                                { label: 'Socialization', key: 'socialization' },
                                { label: 'Stress Level', key: 'stressLevel' }
                            ].map(({ label, key }) => (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={styles.label}>{label}</Text>
                                    <View style={styles.ratingContainer}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                            <TouchableOpacity
                                                key={value}
                                                onPress={() => setReport(prev => ({ ...prev, [key]: value }))}
                                                style={[
                                                    styles.ratingButton,
                                                    report[key] === value ? styles.ratingButtonActive : styles.ratingButtonInactive
                                                ]}
                                            >
                                                <Text style={report[key] === value ? styles.ratingTextActive : styles.ratingTextInactive}>
                                                    {value}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Training Result</Text>
                                <View style={styles.passedContainer}>
                                    <Text style={[
                                        styles.passedText,
                                        { color: report.isPassed ? '#34C759' : '#666' }
                                    ]}>
                                        {report.isPassed ? 'Passed' : 'Not Passed'}
                                    </Text>
                                    <Switch
                                        value={report.isPassed}
                                        onValueChange={(value) => setReport(prev => ({ ...prev, isPassed: value }))}
                                        trackColor={{ false: '#767577', true: '#34C759' }}
                                        thumbColor={report.isPassed ? '#fff' : '#f4f3f4'}
                                        ios_backgroundColor="#767577"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Notes</Text>
                                <TextInput
                                    style={styles.notesInput}
                                    value={report.notes}
                                    onChangeText={(text) => setReport(prev => ({ ...prev, notes: text }))}
                                    placeholder="Enter additional notes"
                                    multiline={true}
                                    textAlignVertical="top"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default TrainingReportModal;