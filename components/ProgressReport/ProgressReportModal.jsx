import {
    View, Text, Modal, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

// Memoized InputSection for edit mode
const InputSection = React.memo(({ title, value, onChangeText, placeholder }) => (
    <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            {title}
        </Text>
        <TextInput
            style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#fff',
                minHeight: 100,
                textAlignVertical: 'top'
            }}
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

// Memoized ViewSection for read-only mode
const ViewSection = React.memo(({ title, content }) => (
    <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            {title}
        </Text>
        <View style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#f8f9fa',
            minHeight: 60
        }}>
            <Text style={{ fontSize: 16, color: '#444', lineHeight: 24 }}>
                {content}
            </Text>
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
        } else if (existingReport) {
            setReport(existingReport);
        } else {
            feedbackRef.current?.focus();
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
            await onSubmit(report);
            Alert.alert(
                'Success',
                'Progress report submitted successfully!',
                [{ text: 'OK', onPress: onClose }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit progress report. Please try again.');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                            marginTop: 'auto',
                            maxHeight: '90%'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }}>
                                        Progress Report
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                                        {dogName} - {existingReport && format(new Date(existingReport.attendanceDate), 'MMMM d, yyyy')}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={{ padding: 5 }}
                                >
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {existingReport && (
                                <View style={{
                                    backgroundColor: '#e8f4fd',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <MaterialIcons name="person" size={20} color="#007AFF" />
                                    <Text style={{ marginLeft: 8, color: '#007AFF', fontSize: 14 }}>
                                        Trainer: {existingReport.trainerName}
                                    </Text>
                                </View>
                            )}

                            <ScrollView
                                style={{ marginBottom: existingReport ? 16 : 80 }}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {existingReport ? (
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

                            {!existingReport && (
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
                                        onPress={handleSubmit}
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
                                            {loading ? 'Submitting...' : 'Submit Report'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {existingReport && (
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        padding: 15,
                                        borderRadius: 8,
                                        backgroundColor: '#007AFF',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}