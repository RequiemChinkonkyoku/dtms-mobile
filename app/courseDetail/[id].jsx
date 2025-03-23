import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchCourseById } from '../../services/CourseService';
import { MaterialIcons } from '@expo/vector-icons';
import { courseDetailsStyles } from '../../styles/CourseDetailStyles';
import { fetchLessonById } from '../../services/LessonService';
import { fetchDogBreedById } from '../../services/DogBreedService';
import { LinearGradient } from 'expo-linear-gradient';
import EnrollmentModal from '../../components/CourseDetail/EnrollmentModal';

export default function CourseDetail() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [dogBreeds, setDogBreeds] = useState([]);

    const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] = useState(false);

    useEffect(() => {
        loadCourseDetail();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Course Detail',
            headerShown: true
        });
    }, []);

    const loadCourseDetail = async () => {
        const courseData = await fetchCourseById(id);
        if (courseData) {
            setCourse(courseData);

            // Fetch lessons
            if (courseData.lessonIds && courseData.lessonIds.length > 0) {
                const lessonPromises = courseData.lessonIds.map(lessonId =>
                    fetchLessonById(lessonId)
                );
                const lessonResults = await Promise.all(lessonPromises);
                // Filter out null responses and map to the correct structure
                const validLessons = lessonResults
                    .filter(result => result && result)
                    .map(result => result);
                setLessons(validLessons);
            }

            // Fetch dog breeds
            if (courseData.dogBreedIds && courseData.dogBreedIds.length > 0) {
                const breedPromises = courseData.dogBreedIds.map(breedId =>
                    fetchDogBreedById(breedId)
                );
                const breedResults = await Promise.all(breedPromises);
                setDogBreeds(breedResults.filter(breed => breed !== null));
            }
        }
    };

    if (!course) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={courseDetailsStyles.container}>
                <Image
                    source={typeof course.imageUrl === 'string'
                        ? { uri: course.imageUrl }
                        : require('./../../assets/images/dog.png')}
                    style={courseDetailsStyles.image}
                />

                {/* Course Header */}
                <View style={courseDetailsStyles.headerContainer}>
                    <Text style={courseDetailsStyles.title}>{course.name}</Text>
                    <Text style={courseDetailsStyles.trainer}>
                        Created by {course.createdTrainerId || 'Unknown'}
                    </Text>
                </View>

                {/* Course Stats */}
                <View style={courseDetailsStyles.statsContainer}>
                    <InfoItem
                        icon="schedule"
                        label="Duration"
                        value={`${course.durationInWeeks} weeks`}
                    />
                    <InfoItem
                        icon="calendar-today"
                        label="Sessions"
                        value={`${course.daysPerWeek} days/week`}
                    />
                    <InfoItem
                        icon="groups"
                        label="Capacity"
                        value={`${course.minDogs}-${course.maxDogs} dogs`}
                    />
                </View>

                {/* Eligible Dog Breeds */}
                <View style={courseDetailsStyles.breedContainer}>
                    <Text style={courseDetailsStyles.breedTitle}>Suitable for</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={courseDetailsStyles.breedScroll}>
                        {dogBreeds.map(breed => (
                            <View key={breed.id} style={courseDetailsStyles.breedTag}>
                                <MaterialIcons name="pets" size={16} color="#007AFF" />
                                <Text style={courseDetailsStyles.breedName}>{breed.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Price Section */}
                <View style={courseDetailsStyles.priceContainer}>
                    <Text style={courseDetailsStyles.priceLabel}>Course Price</Text>
                    <Text style={courseDetailsStyles.price}>{course.price}VNĐ</Text>
                </View>

                {/* Description */}
                <View style={courseDetailsStyles.section}>
                    <Text style={courseDetailsStyles.sectionTitle}>Description</Text>
                    <Text style={courseDetailsStyles.description}>
                        {course.description || 'No description available'}
                    </Text>
                </View>

                {/* Additional Details */}
                <View style={courseDetailsStyles.section}>
                    <Text style={courseDetailsStyles.sectionTitle}>Course Details</Text>
                    <View style={courseDetailsStyles.detailsGrid}>
                        <DetailItem label="Slots per Day" value={course.slotsPerDay} />
                        <DetailItem label="Trainers" value={`${course.minTrainers}-${course.maxTrainers}`} />
                        <DetailItem label="Complexity" value={`Level ${course.complexity}`} />
                        <DetailItem label="Status" value={course.status === 1 ? 'Active' : 'Inactive'} />
                    </View>
                </View>

                {/* Lessons Section */}
                <View style={courseDetailsStyles.section}>
                    <Text style={courseDetailsStyles.sectionTitle}>Course Lessons</Text>
                    {lessons && lessons.length > 0 ? (
                        lessons.map((lesson, index) => (
                            <View key={lesson.id} style={courseDetailsStyles.lessonContainer}>
                                <MaterialIcons name="class" size={24} color="#007AFF" />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={courseDetailsStyles.lessonTitle}>
                                        {index + 1}. {lesson.lessonTitle}
                                    </Text>
                                    <Text style={courseDetailsStyles.lessonDescription}>
                                        {lesson.description}
                                    </Text>
                                    <View style={courseDetailsStyles.lessonDetails}>
                                        <Text style={courseDetailsStyles.lessonInfo}>
                                            <MaterialIcons name="schedule" size={16} color="#666" /> {lesson.duration} minutes
                                        </Text>
                                        <Text style={courseDetailsStyles.lessonInfo}>
                                            <MaterialIcons name="room" size={16} color="#666" /> {lesson.environment}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={courseDetailsStyles.description}>No lessons available</Text>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={courseDetailsStyles.enrollButtonContainer}>
                <LinearGradient
                    colors={['#007AFF', '#00A2FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={courseDetailsStyles.gradientContainer}
                >
                    <TouchableOpacity
                        style={courseDetailsStyles.enrollButton}
                        onPress={() => {
                            console.log('Enroll pressed for course:', id);
                            setIsEnrollmentModalVisible(true);
                        }}
                    >
                        <View>
                            <Text style={courseDetailsStyles.enrollButtonText}>Enroll Now</Text>
                            <Text style={courseDetailsStyles.enrollSubText}>Start Your Dog's Journey Today</Text>
                        </View>
                        <Text style={courseDetailsStyles.enrollPrice}>
                            {course.price.toLocaleString()}
                            <Text style={courseDetailsStyles.currencyText}> VNĐ</Text>
                        </Text>
                    </TouchableOpacity>
                    <EnrollmentModal
                        visible={isEnrollmentModalVisible}
                        onClose={() => setIsEnrollmentModalVisible(false)}
                        courseId={id}
                    />
                </LinearGradient>
            </View>
        </>
    );
}

const InfoItem = ({ icon, label, value }) => (
    <View style={courseDetailsStyles.infoItem}>
        <MaterialIcons name={icon} size={24} color="#666" />
        <Text style={courseDetailsStyles.infoLabel}>{label}</Text>
        <Text style={courseDetailsStyles.infoValue}>{value}</Text>
    </View>
);

const DetailItem = ({ label, value }) => (
    <View style={courseDetailsStyles.detailItem}>
        <Text style={courseDetailsStyles.detailLabel}>{label}</Text>
        <Text style={courseDetailsStyles.detailValue}>{value}</Text>
    </View>
);
