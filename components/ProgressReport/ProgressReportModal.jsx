import {
    View, Text, Modal, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProgressReportModal({ visible, onClose, onSubmit, dogName, loading, attendanceId, trainerId }) {
    const [report, setReport] = useState({
        feedback: '',
        healthObservation: '',
        behaviorObservation: '',
        performanceObservation: '',
        status: 0,
        attendanceId: attendanceId,
        trainerId: trainerId
    });

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
        }
    }, [visible, attendanceId, trainerId]);

    const InputSection = ({ title, value, onChangeText, placeholder }) => (
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
    );

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
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Progress Report - {dogName}
                            </Text>
                            <TouchableOpacity 
                                onPress={onClose}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={{ padding: 5 }}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={{ marginBottom: 80 }}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="none"
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <InputSection
                                title="Overall Feedback"
                                value={report.feedback}
                                onChangeText={(text) => setReport(prev => ({ ...prev, feedback: text }))}
                                placeholder="Enter overall feedback..."
                            />
                            <InputSection
                                title="Health Observation"
                                value={report.healthObservation}
                                onChangeText={(text) => setReport(prev => ({ ...prev, healthObservation: text }))}
                                placeholder="Enter health observations..."
                            />
                            <InputSection
                                title="Behavior Observation"
                                value={report.behaviorObservation}
                                onChangeText={(text) => setReport(prev => ({ ...prev, behaviorObservation: text }))}
                                placeholder="Enter behavior observations..."
                            />
                            <InputSection
                                title="Performance Observation"
                                value={report.performanceObservation}
                                onChangeText={(text) => setReport(prev => ({ ...prev, performanceObservation: text }))}
                                placeholder="Enter performance observations..."
                            />
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
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}