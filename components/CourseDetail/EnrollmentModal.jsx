import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';
import { fetchClassesByCourseId, fetchClassById } from '../../services/ClassService';
import EnrollmentSteps from './EnrollmentSteps';

export default function EnrollmentModal({ visible, onClose, courseId, maxDogs, coursePrice }) {
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [showEnrollmentSteps, setShowEnrollmentSteps] = useState(false);

    useEffect(() => {
        if (visible) {
            loadClasses();
        } else {
            // Cleanup when modal closes
            setSelectedClass(null);
            setClassDetails(null);
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
                Starting: {new Date(classItem.startingDate).toLocaleDateString("vi-VN")}
            </Text>
            <Text style={courseDetailsStyles.classInfo}>
                Students: {classItem.enrolledDogCount} / {maxDogs} dogs enrolled
            </Text>
            {classItem.assignedTrainerCount > 0 && (
                <Text style={courseDetailsStyles.classInfo}>
                    Number Of Trainers: {classItem.assignedTrainerCount}
                </Text>
            )}
        </TouchableOpacity>
    ), [selectedClass]);

    const loadClasses = async () => {
        const classes = await fetchClassesByCourseId(courseId);
        setAvailableClasses(classes);
    };

    const handleClassSelect = async (classItem) => {
        if (selectedClass?.id === classItem.id) {
            setSelectedClass(null);
            setClassDetails(null);
        } else {
            setSelectedClass(classItem);
            const details = await fetchClassById(classItem.id);
            setClassDetails(details);
        }
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Modal
                visible={visible && !showEnrollmentSteps}
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
                        {classDetails && (
                            <View style={courseDetailsStyles.slotsContainer}>
                                <Text style={courseDetailsStyles.slotsTitle}>Class Schedule</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {classDetails.classSlots
                                        .sort((a, b) => new Date(a.slotDate) - new Date(b.slotDate))
                                        .map((slot, index) => (
                                            <View key={index} style={courseDetailsStyles.slotItem}>
                                                <MaterialIcons name="event" size={24} color="#007AFF" />
                                                <Text style={courseDetailsStyles.slotDate}>
                                                    {new Date(slot.slotDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Text>
                                                <Text style={courseDetailsStyles.slotTime}>
                                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                </Text>
                                            </View>
                                        ))}
                                </ScrollView>
                                {classDetails.assignedTrainers.length > 0 && (
                                    <View style={courseDetailsStyles.trainersSection}>
                                        <Text style={courseDetailsStyles.trainersTitle}>Assigned Trainers:</Text>
                                        {classDetails.assignedTrainers.map(trainer => (
                                            <Text key={trainer.id} style={courseDetailsStyles.trainerName}>
                                                • {trainer.name}
                                            </Text>
                                        ))}
                                    </View>
                                )}
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
                                onPress={() => setShowEnrollmentSteps(true)}
                            >
                                <Text style={courseDetailsStyles.confirmButtonText}>Continue to Enrollment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <EnrollmentSteps
                visible={showEnrollmentSteps}
                onClose={() => {
                    setShowEnrollmentSteps(false);
                    onClose();
                }}
                selectedClass={selectedClass}
                courseId={courseId}
                coursePrice={coursePrice}
            />
        </>
    );
}