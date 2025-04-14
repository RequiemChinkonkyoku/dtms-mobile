import { View, Text, Modal, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';
import { fetchUserDog } from '../../services/DogService';
import { useAuth } from '../../contexts/AuthContext';
import { enrollInClass } from '../../services/ClassService';
import { createVNPayPayment, checkPaymentStatus } from '../../services/PaymentService';
import { router } from 'expo-router';
import * as ExpoLinking from 'expo-linking';

export default function EnrollmentSteps({ visible, onClose, selectedClass, courseId, coursePrice }) {
    const [step, setStep] = useState(1);
    const [dogs, setDogs] = useState([]);
    const [selectedDog, setSelectedDog] = useState(null);
    const [isBoarding, setIsBoarding] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const { userInfo } = useAuth();

    useEffect(() => {
        if (visible) {
            loadDogs();
        } else {
            resetForm();
        }
    }, [visible]);

    const loadDogs = async () => {
        if (userInfo?.unique_name) {
            const userDogs = await fetchUserDog(userInfo.unique_name);
            const activeDogs = userDogs.filter(dog => dog.status === 1);
            setDogs(activeDogs || []);
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedDog(null);
        setIsBoarding(false);
        setAgreedToTerms(false);
    };

    const handleEnrollment = async () => {
        try {
            if (!selectedClass?.id || !selectedDog?.id || !userInfo?.unique_name) {
                Alert.alert('Error', 'Missing required enrollment information');
                return;
            }

            const enrollmentData = {
                customerProfileId: userInfo.unique_name,
                classId: selectedClass.id,
                dogId: selectedDog.id,
                isBoarding: isBoarding
            };

            const result = await enrollInClass(enrollmentData);
            
            console.log('Enrollment Data:', enrollmentData); // For debugging

            if (result && result.success) {
                Alert.alert(
                    'Enrollment Successful',
                    'You have successfully enrolled in the class. Please complete the pretest to proceed with payment.',
                    [{ text: 'OK', onPress: () => onClose() }]
                );

            } else {
                const errorMessage = result?.message || 'Failed to enroll in class. Please try again.';
                Alert.alert('Enrollment Failed', errorMessage);
            }
        } catch (error) {
            console.error('Enrollment Error:', error);
            Alert.alert(
                'Error',
                'Failed to enroll in class. Please check your connection and try again.'
            );
        }
    };

    const renderDogSelection = () => (
        <ScrollView style={courseDetailsStyles.stepContainer}>
            <Text style={courseDetailsStyles.stepTitle}>Select Your Dog</Text>
            {dogs.map(dog => (
                <TouchableOpacity
                    key={dog.id}
                    style={[
                        courseDetailsStyles.dogItem,
                        selectedDog?.id === dog.id && courseDetailsStyles.selectedDogItem
                    ]}
                    onPress={() => {
                        if (selectedDog?.id === dog.id) {
                            setSelectedDog(null);
                        } else {
                            setSelectedDog(dog);
                        }
                    }}
                >
                    <MaterialIcons
                        name="pets"
                        size={24}
                        color={selectedDog?.id === dog.id ? "#007AFF" : "#666"}
                    />
                    <View style={courseDetailsStyles.dogInfo}>
                        <Text style={courseDetailsStyles.dogName}>{dog.name}</Text>
                        <Text style={courseDetailsStyles.dogBreed}>{dog.dogBreedName}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderBoardingOption = () => (
        <View style={courseDetailsStyles.stepContainer}>
            <Text style={courseDetailsStyles.stepTitle}>Boarding Option</Text>
            <View style={courseDetailsStyles.boardingContainer}>
                <View style={courseDetailsStyles.boardingInfo}>
                    <Text style={courseDetailsStyles.boardingTitle}>Include Boarding</Text>
                    <Text style={courseDetailsStyles.boardingDescription}>
                        Your dog will stay at our facility during the training period
                    </Text>
                </View>
                <Switch
                    value={isBoarding}
                    onValueChange={setIsBoarding}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isBoarding ? "#007AFF" : "#f4f3f4"}
                />
            </View>
        </View>
    );

    const renderTermsAndConditions = () => (
        <View style={courseDetailsStyles.stepContainer}>
            <Text style={courseDetailsStyles.stepTitle}>Terms & Conditions</Text>
            <View style={courseDetailsStyles.termsWrapper}>
                <ScrollView style={courseDetailsStyles.termsContainer}>
                    <Text style={courseDetailsStyles.termsText}>
                        1. Health Requirements{'\n'}
                        • Your dog must be up-to-date on all vaccinations{'\n'}
                        • Recent health check certificate is required{'\n'}
                        • Any existing health conditions must be disclosed{'\n\n'}
                        2. Safety Measures{'\n'}
                        • Professional trainers will supervise all activities{'\n'}
                        • Emergency veterinary care is available{'\n'}
                        • Regular health monitoring during training{'\n\n'}
                        3. Liability{'\n'}
                        • We maintain insurance for all dogs in our care{'\n'}
                        • You will be notified immediately of any incidents{'\n'}
                        • Detailed daily reports will be provided
                    </Text>
                    <View style={{
                        paddingTop: 30,
                    }}></View>
                </ScrollView>
            </View>
            <TouchableOpacity
                style={courseDetailsStyles.termsCheckbox}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
                <MaterialIcons
                    name={agreedToTerms ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color="#007AFF"
                />
                <Text style={courseDetailsStyles.termsCheckboxText}>
                    I agree to the terms and conditions
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={courseDetailsStyles.modalContainer}>
                <View style={courseDetailsStyles.modalContent}>
                    <ScrollView>
                        <View style={courseDetailsStyles.stepIndicator}>
                            {[1, 2, 3].map((stepNumber) => (
                                <View
                                    key={stepNumber}
                                    style={[
                                        courseDetailsStyles.stepDot,
                                        step >= stepNumber && courseDetailsStyles.activeStepDot
                                    ]}
                                />
                            ))}
                        </View>

                        {step === 1 && renderDogSelection()}
                        {step === 2 && renderBoardingOption()}
                        {step === 3 && renderTermsAndConditions()}
                    </ScrollView>
                    <View style={courseDetailsStyles.enrollmentButtons}>
                        <TouchableOpacity
                            style={courseDetailsStyles.enrollmentCancel}
                            onPress={onClose}
                        >
                            <Text style={courseDetailsStyles.enrollmentCancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {step > 1 && (
                            <TouchableOpacity
                                style={courseDetailsStyles.enrollmentBack}
                                onPress={() => setStep(step - 1)}
                            >
                                <Text style={courseDetailsStyles.enrollmentBackText}>Back</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                courseDetailsStyles.enrollmentNext,
                                (step === 1 && !selectedDog) && courseDetailsStyles.enrollmentDisabled,
                                (step === 3 && !agreedToTerms) && courseDetailsStyles.enrollmentDisabled
                            ]}
                            disabled={(step === 1 && !selectedDog) || (step === 3 && !agreedToTerms)}
                            onPress={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else {
                                    handleEnrollment();
                                }
                            }}
                        >
                            <Text style={courseDetailsStyles.enrollmentNextText}>
                                {step === 3 ? 'Confirm Enrollment' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}