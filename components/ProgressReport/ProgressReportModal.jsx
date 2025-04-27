import {
    View, Text, Modal, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { styles } from '../../styles/ProgressReportModalStyles';

const InputSection = React.memo(({ title, value, onChangeText, placeholder }) => (
    <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TextInput
            style={styles.input}
            multiline
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            blurOnSubmit={false}
            returnKeyType="next"
            enablesReturnKeyAutomatically
        />
    </View>
));

const ViewSection = React.memo(({ title, content }) => (
    <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.viewSection}>
            <Text style={styles.viewSectionText}>{content}</Text>
        </View>
    </View>
));

export default function ProgressReportModal({ visible, onClose, onSubmit, dogName, loading, attendanceId, trainerId, existingReport }) {
    const [report, setReport] = useState({
        feedback: '',
        healthObservation: '',
        behaviorObservation: '',
        performanceObservation: '',
        status: 0,
        attendanceId: attendanceId,
        trainerId: trainerId
    });

    const [isEditing, setIsEditing] = useState(false);
    const feedbackRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            setReport({
                feedback: '',
                healthObservation: '',
                behaviorObservation: '',
                performanceObservation: '',
                status: 0,
                attendanceId: attendanceId,
                trainerId: trainerId
            });
            setIsEditing(false);
        } else if (existingReport) {
            setReport(existingReport);
            setIsEditing(false);
        } else {
            feedbackRef.current?.focus();
            setIsEditing(true);
        }
    }, [visible, attendanceId, trainerId, existingReport]);

    const handleFeedbackChange = useCallback((text) => {
        setReport(prev => ({ ...prev, feedback: text }));
    }, []);

    const handleHealthChange = useCallback((text) => {
        setReport(prev => ({ ...prev, healthObservation: text }));
    }, []);

    const handleBehaviorChange = useCallback((text) => {
        setReport(prev => ({ ...prev, behaviorObservation: text }));
    }, []);

    const handlePerformanceChange = useCallback((text) => {
        setReport(prev => ({ ...prev, performanceObservation: text }));
    }, []);

    const handleSubmit = async () => {
        if (!report.feedback || !report.healthObservation ||
            !report.behaviorObservation || !report.performanceObservation) {
            Alert.alert('Missing Fields', 'Please fill in all observation fields');
            return;
        }
        try {
            await onSubmit(report, existingReport?.id);
            // Alert.alert(
            //     'Success',
            //     `Progress report ${existingReport ? 'updated' : 'submitted'} successfully!`,
            //     [{ text: 'OK', onPress: () => {
            //         setIsEditing(false);
            //         onClose();
            //     }}]
            // );
        } catch (error) {
            Alert.alert('Error', `Failed to ${existingReport ? 'update' : 'submit'} progress report. Please try again.`);
        }
    };

    const handleCancel = () => {
        if (isEditing && existingReport) {
            setReport(existingReport);
            setIsEditing(false);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.overlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <View>
                                    <Text style={styles.title}>Progress Report</Text>
                                    <Text style={styles.subtitle}>
                                        {dogName} - {existingReport && format(new Date(existingReport.attendanceDate), 'MMMM d, yyyy')}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={styles.closeButton}
                                >
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {existingReport && (
                                <View style={styles.trainerInfo}>
                                    <MaterialIcons name="person" size={20} color="#007AFF" />
                                    <Text style={styles.trainerText}>
                                        Trainer: {existingReport.trainerName}
                                    </Text>
                                </View>
                            )}

                            <ScrollView
                                style={existingReport ? styles.scrollView : styles.scrollViewWithActions}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {existingReport && !isEditing ? (
                                    <>
                                        <ViewSection title="Overall Feedback" content={report.feedback} />
                                        <ViewSection title="Health Observation" content={report.healthObservation} />
                                        <ViewSection title="Behavior Observation" content={report.behaviorObservation} />
                                        <ViewSection title="Performance Observation" content={report.performanceObservation} />
                                    </>
                                ) : (
                                    <>
                                        <InputSection
                                            title="Overall Feedback"
                                            value={report.feedback}
                                            onChangeText={handleFeedbackChange}
                                            placeholder="Enter overall feedback..."
                                        />
                                        <InputSection
                                            title="Health Observation"
                                            value={report.healthObservation}
                                            onChangeText={handleHealthChange}
                                            placeholder="Enter health observations..."
                                        />
                                        <InputSection
                                            title="Behavior Observation"
                                            value={report.behaviorObservation}
                                            onChangeText={handleBehaviorChange}
                                            placeholder="Enter behavior observations..."
                                        />
                                        <InputSection
                                            title="Performance Observation"
                                            value={report.performanceObservation}
                                            onChangeText={handlePerformanceChange}
                                            placeholder="Enter performance observations..."
                                        />
                                    </>
                                )}
                            </ScrollView>

                            <View style={styles.actionBar}>
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    style={[styles.button, styles.cancelButton]}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        {isEditing ? 'Cancel' : 'Close'}
                                    </Text>
                                </TouchableOpacity>
                                {(isEditing || !existingReport) ? (
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        disabled={loading}
                                        style={[
                                            styles.button,
                                            styles.submitButton,
                                            loading && styles.disabledButton
                                        ]}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? (existingReport ? 'Updating...' : 'Submitting...') 
                                                    : (existingReport ? 'Update Report' : 'Submit Report')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => setIsEditing(true)}
                                        style={[styles.button, styles.submitButton]}
                                    >
                                        <Text style={styles.buttonText}>Edit Report</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}