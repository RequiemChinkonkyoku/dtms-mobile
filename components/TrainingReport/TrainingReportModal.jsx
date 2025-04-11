import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createTrainingReport } from '../../services/TrainingReportService';

const TrainingReportModal = ({ visible, onClose, enrollment, trainerProfileId }) => {
    const [report, setReport] = useState({
        behaviorType: '',
        intensity: 5,
        reactionToCommands: 5,
        socialization: 5,
        stressLevel: 5,
        notes: '',
        enrollmentId: enrollment?.id,
        trainerProfileId: trainerProfileId
    });

    const handleSubmit = async () => {
        try {
            const response = await createTrainingReport(report);
            if (response.success) {
                Alert.alert('Success', 'Training report submitted successfully');
                onClose();
            } else {
                Alert.alert('Error', response.error || 'Failed to submit training report');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit training report');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Training Report for {enrollment?.dogName}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 16, marginBottom: 5 }}>Behavior Type</Text>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 }}
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
                            <View key={key} style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 16, marginBottom: 5 }}>{label}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                        <TouchableOpacity
                                            key={value}
                                            onPress={() => setReport(prev => ({ ...prev, [key]: value }))}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 15,
                                                backgroundColor: report[key] === value ? '#007AFF' : '#f0f0f0',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 5
                                            }}
                                        >
                                            <Text style={{ color: report[key] === value ? 'white' : 'black' }}>{value}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, marginBottom: 5 }}>Notes</Text>
                            <TextInput
                                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, height: 100 }}
                                value={report.notes}
                                onChangeText={(text) => setReport(prev => ({ ...prev, notes: text }))}
                                placeholder="Enter additional notes"
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#007AFF',
                                padding: 15,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginTop: 10
                            }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Submit Report</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default TrainingReportModal;