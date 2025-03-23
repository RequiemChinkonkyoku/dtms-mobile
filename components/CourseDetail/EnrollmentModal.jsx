import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';
import { fetchClassesByCourseId, fetchClassSlots } from '../../services/ClassService';

export default function EnrollmentModal({ visible, onClose, courseId }) {
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSlots, setClassSlots] = useState([]);

    useEffect(() => {
        if (visible) {
            loadClasses();
        } else {
            // Cleanup when modal closes
            setSelectedClass(null);
            setClassSlots([]);
            setAvailableClasses([]);
        }
    }, [visible]);

    const renderClassItem = React.useCallback((classItem) => (
        <TouchableOpacity
            key={classItem.id}
            style={[
                courseDetailsStyles.classItem,
                selectedClass?.id === classItem.id && courseDetailsStyles.selectedClassItem
            ]}
            onPress={() => handleClassSelect(classItem)}
        >
            <Text style={courseDetailsStyles.className}>{classItem.name}</Text>
            <Text style={courseDetailsStyles.classInfo}>
                Starting: {new Date(classItem.startingDate).toLocaleDateString()}
            </Text>
            <Text style={courseDetailsStyles.classInfo}>
                Students: {classItem.enrolledDogCount} enrolled
            </Text>
        </TouchableOpacity>
    ), [selectedClass]);

    const loadClasses = async () => {
        const classes = await fetchClassesByCourseId(courseId);
        setAvailableClasses(classes);
    };

    const handleClassSelect = async (classItem) => {
        if (selectedClass?.id === classItem.id) {
            setSelectedClass(null);
            setClassSlots([]);
        } else {
            setSelectedClass(classItem);
            const slots = await fetchClassSlots(classItem.id);
            setClassSlots(slots);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={courseDetailsStyles.modalContainer}>
                <View style={courseDetailsStyles.modalContent}>
                    <Text style={courseDetailsStyles.modalTitle}>Available Classes</Text>
                    <ScrollView>
                        {availableClasses.length > 0 ? (
                            availableClasses.map(renderClassItem)
                        ) : (
                            <View style={courseDetailsStyles.noClassesContainer}>
                                <MaterialIcons name="error-outline" size={48} color="#666" />
                                <Text style={courseDetailsStyles.noClassesText}>No classes available at the moment</Text>
                                <Text style={courseDetailsStyles.noClassesSubText}>Please check back later</Text>
                            </View>
                        )}
                    </ScrollView>
                    {selectedClass && (
                        <View style={courseDetailsStyles.slotsContainer}>
                            <Text style={courseDetailsStyles.slotsTitle}>Class Schedule</Text>
                            <ScrollView horizontal>
                                {classSlots.map((slot) => (
                                    <View key={slot.id} style={courseDetailsStyles.slotItem}>
                                        <Text>{new Date(slot.date).toLocaleDateString()}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                    <View style={courseDetailsStyles.modalButtons}>
                        <TouchableOpacity
                            style={courseDetailsStyles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={courseDetailsStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                courseDetailsStyles.confirmButton,
                                !selectedClass && courseDetailsStyles.disabledButton
                            ]}
                            disabled={!selectedClass}
                            onPress={() => {
                                // TODO: Implement final enrollment logic
                                console.log('Enrolling in class:', selectedClass.id);
                                onClose();
                            }}
                        >
                            <Text style={courseDetailsStyles.confirmButtonText}>Confirm Enrollment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}